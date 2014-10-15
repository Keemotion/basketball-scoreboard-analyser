basketball-scoreboard-analyser
==============================

Demo at http://fkint.github.io/basketball-scoreboard-analyser/ <br>
The input file corresponding to the default image can be found at: http://fkint.github.io/basketball-scoreboard-analyser/testdata/ScoreBoardConfigv2.prm

<h2>User interface</h2>
<ul>
<li>Toolbar:
<ul>
<li>Mouse mode: Default (edition)
<li>Mouse mode: Drag canvas
<li>Mouse mode: move digits
<li>Import JSON file
<li>Import PRM file
<li>Export as JSON file
<li>Export as PRM file
<li>Set canvas image
<li>Reset canvas view (image centered and full-area)
<li>Reset configuration (remove all objects)
<li>Clear configuration (empty all nodes at the root level)
<li>Autofocus (centers canvas around selected elements)
</ul>
</li>
<li>Mouse:
<ul>
<li>Default mouse mode:
<ul>
<li>Click inside a digit -> select digit
<li>Click & drag near corner of selected digit/led -> move digit/led
<li>Click & drag to select a rectangular region when a digits group is selected -> autodetect digit corners in that region
<li>Click 4 times on the canvas when a digits group is selected -> create new digit with corners on those spots
<li>Click on an element in the tree to select it
<li>Double-click on an element on the canvas to expand its corresponding tree element
<li>Press ctrl to switch to 'Drag canvas mode'
<li>Press delete to delete the selected object
</ul>
</li>
<li>Drag canvas mode: self-explanatory
<li>Move digits mode:
<ul>
<li>Click on a digit to select it (shift to toggle selection, ctrl to add to selection)
<li>Click & drag outside the selected digits to select a rectangular region -> select all digits (of which the center is) inside that region
<li>Click & drag starting at one of the selected digits to translate the selection
</ul>
</li>
</ul>
</li>



