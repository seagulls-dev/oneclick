import { Injectable } from '@angular/core';
import { DocumentReference } from '@firebase/firestore-types';
import { Subject, Observable } from 'rxjs';
import { DeepCopy } from '../helpers/deep-copy';

import { Config } from './config.model';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private sources: { [configSource: string]: Source } = {};
  private sourceCache: { [sourceId: string]: Source } = {};

  // Fires every time a new config document is loaded with the type of document
  private _documentLoaded$ = new Subject<ConfigDocument>();
  documentLoaded$: Observable<ConfigDocument>;

  constructor() {
    this.documentLoaded$ = this._documentLoaded$.asObservable();
  }

  private static isConfigSource(input: ConfigSource|string): input is ConfigSource {
    return false ||
      input === 'environment' ||
      input === 'business' ||
      input === 'destination';
  }
  private static getAreas(): ConfigSource[] {
    return ['environment', 'business', 'destination'];
  }
  private static generateSourceId(type: ConfigSource, ref: DocumentReference): string {
    // The type,
    // the document reference (businessId, destinationId...),
    // and the id of it's parent (only for businesses and environments)
    let id = type + '+' + ref.id;
    if(type === 'business' || type === 'destination')
      id += '+' + ref.parent.parent.id;

    return id;
  }

  getSourceId(sourceId: string): string|false {
    const source = this.sources[sourceId];

    if(!source){
      // Don't throw here because this happens legitimately when the business changes
      // throw Error(`SourceId ${sourceId} not found in ${Object.keys(this.sources).join(', ')}`);
      return false;
    }

    return source.id;
  }
  getConfig<T>(property: string, defaultValue?: T|any): T {
    /** Looks in a destination and then in the root for a config property,
     *  returning the most specific value, or false if it can't be found
     *
     *  property looks like a full path from config "client.layoutGeneration.structures"
     *  if the value isn't found, defaultValue (or false) is returned
    */
    var path = property.split('.'), areas: ConfigSource[];

    if(ConfigService.isConfigSource(path[0]))
      areas = path.splice(0, 1) as ConfigSource[];
    else
      areas = ConfigService.getAreas();

    if(path.length < 2)
      throw Error('Config properties must be in the format document.property.subproperty.etc ... separated by periods');

    for(let area of areas){
      let source = this.sources[area];

      // the source has not been configured, but this is normal during load
      if(!source)
        continue;

      // I can't just pass it through because I need to preserve `this`
      let value = source.getConfig(path, type => this._documentLoaded$.next(type));
      if(value !== undefined)
        return DeepCopy.copy(value);
    }

    if(defaultValue === undefined)
      throw Error(`Property ${property} could not be found, and no default was provided`);

    return DeepCopy.copy(defaultValue);
  }

  init(type: ConfigSource, ref: DocumentReference): Promise<void> {
    var source: Source;
    let sourceId = ConfigService.generateSourceId(type, ref);

    let pending = [];
    if(this.sourceCache[sourceId])
      source = this.sourceCache[sourceId];
    else {
      source = new Source(ref);
      this.sourceCache[sourceId] = source;
      pending.push(
        source.loadConfig('client'));
    }

    // this is what injects it for use
    this.sources[type] = source;
    return Promise.all(pending)
      .then(() => {});
  }
  deinit(type: ConfigSource): void {
    // Erase data from all sources of this type, and all types at 'lower' levels
    // Ex: If we're de-initializing the business, also deinit the destinations
    if(!ConfigService.isConfigSource(type))
      throw Error(`[config.service:deinit] Cannot deinit type ${type} because it's not a ConfigSource`);

    // TODO: consider putting these in a special 'deleted' state
    // I don't know when/how we would exit that state though
    // I'm worried that if the code runs improperly,
    // it will immediately reload the information from the OLD location
    const areas = ConfigService.getAreas();
    for(let i = areas.indexOf(type); i < areas.length; i++){
      const targetType = areas[i];
      for(let sourceId in this.sourceCache)
        if(sourceId.substr(0, targetType.length) === targetType)
          delete this.sourceCache[sourceId];

      delete this.sources[targetType];
    }
  }
}

class Source {
  private ref: DocumentReference;
  id: string;
  config: Config | { [docId: string]: 'loading'|null|undefined } = {};

  constructor(ref: DocumentReference){
    this.ref = ref;
    this.id = this.ref.id;
  }

  private static isConfigDocument(input: ConfigDocument|string): input is ConfigDocument {
    return typeof input === 'string' &&
           ['client','server','training','moola'].indexOf(input) > -1;
  }

  async loadConfig(doc: ConfigDocument): Promise<ConfigDocument> {
    this.config[doc] = 'loading';
    if(!this.ref)
      throw Error(`ref has not yet been defined on the source`);

    const configDoc = await this.ref.collection('config').doc(doc).get();
    const id = configDoc.ref.id;
    const data = configDoc.data() || null;
    this.config[id] = data;
    return doc;
  }

  getConfig(path: string[], loadedCallback?: (type: ConfigDocument) => void): any|undefined {
    const [docId, ...properties] = path;
    // let docId = path.splice(0, 1)[0] as ConfigDocument;
    if(!Source.isConfigDocument(docId))
      throw Error(`a document can only be one of: client, server, training, or moola. Received ${docId}`);

    let doc = this.config[docId];

    if(doc === null || doc === 'loading')
      return; // it was already loaded and non-existant, or it is still loading
    else if(doc === undefined)
      this.loadConfig(docId).then(loadedCallback);
    else {
      var value = doc;
      for(let property of properties){
        value = value[property];
        if(value === undefined)
          return;
      }

      return value;
    }
  }
}

export type ConfigSource = 'environment'|'business'|'destination';
export type ConfigDocument = 'client'|'server'|'training'|'moola';
