# Layout Design Principals

**Customized:** Every stores does things a little differently, and the layout should support that.
Positions should have different names and different shapes, and different limits
to match how the store wants to use it.

**Correct:** Positions should model how the store actually uses it


# Layout Design Rules
A list of available properties with notes about their usage are contained in
```/oneclick/src/app/organize-shifts/layout.model.ts```.

1. Layout.maxColumns must be set for it to display correctly
2. Layouts display best when there are 4-6 columns
3. Layouts should consistently use the same number of columns

# How To Edit Layouts

1. List out which positions should be included on the layout
2. draw a picture of what it should look like (or have a store owner do this)
3. Design the layout by shifting things around so they make sense
    - Make sure the columns are used consistently
    - Look for parallelism eg/ Always put the bagger on the bottom
    - Try to keep it similar to what other layouts are like
    - Always respect the way the local store does it
4. Turn the drawing into a structure (replace, edit, or build new)
    - Watch the syntax: always work inbetween the matching, same level brackets
    - Make sure commas split up properties and arrays
    - Match the rules and style observed in the documents already
    - Ensure each of the position `id` fields are unique to the layout
5. Go back and add in requireTraining fields where appropriate
    - not on leadership positions, nor positions that aren't actually doing things
6. Optional: go back and add in positionGroup fields to fine tune how groups are calculated
7. Optional: go back and add in jobTitle fields to enable HotSchedules auto-scheduling
8. If you edited or replaced an existing structure, increment the counter at the end of the ID
    - Make sure you change every occurance of it in the file!
      + (Consider using **cmd-f** or **ctrl-f** to replace all of them at once)

9. We're still not done!
10. Make sure the new structure is used correctly by reviewing the `meta` and `template` objects
11. Save all your work
12. `git status` to view files w/ changes, `git diff` to view changes `git commit -m "my descriptive message"` on master
13. use the `send` script to the all the changes to the database
14. For 2nd Mile Service, go to the app and delete empty layouts so they will be created with the new config
