ff_sim
======

ff_sim is a Javascript engine, written in (mostly) OOP structure, whose purpose is to simulate Final Fantasy-style battles in the browser.

Key Features
============

Randomization
-------------
 
Each combatant is comprised of several randomized qualities, which are baked together using fantasy themed rules and functions (no female dwarves, giants aren't smart enough to be mages, etc). Nearly every combination of qualities in Combatants, Abilities, and Effects has a distinct name. In all, over 800 distinct Combatants (at the time of this writing) are possible. This is nearly infinitely extensible as long as you don't run out of names to call things. 
 
Behavior
--------

In its initial state, random abilities are chosen by a combatant when it's their turn. When complete, distinct behavior functions will choose which ability to use after surveying the battle. Each archetype (tank, healer, rangedInt, rangedDex, meleeDex, meleeStr) will be defined with distinct choices and preferences.

Customization
-------------

Currently, the names and numbers used by the individual pieces reside with each piece - Combatants know everything about every kind of Combatant, for example. I am currently in the process of extracting all of the strings and numbers out into a config.json file that can easily be edited. This file will be loaded via jQuery AJAX (because Javascript sucks at loading files), and pieced out to the constructors as they need them.

Combatants
----------

 * Races: human, dwarf, elf, halfling, troll, orc, giant, merfolk, demon
 
 * Archetypes: tank, healer, rangedInt, rangedDex, meleeStr, meleeDex
 
 * Elements: fire, ice, earth, air, holy, evil, life, death, physical, psychic
 
 * Genders: male, female
 
A combatant is created with these four qualities, each randomized. Races and Archetypes each have a layer of stats which can be zippered together (along with miscellaneous mods) into a singular stat. With the exception of Gender, each quality has a corresponding Ability. 

For example, let's create a new Combatant: `var gary = new Combatant('left', 0, 'rangedInt', 'fire', 'troll', 'male')` The Combatant constructor recognizes that the combination of 'fire' element and 'rangedInt' archetype should be called a 'Pyromancer'. It also sees that Gary is both 'fire' element and 'troll' race, which it knows is called a 'fire troll'. This is displayed to the user as "Gary, Fire Troll Pyromancer".

Abilities
---------

When _Gary, Fire Troll Pyromancer_ is constructed, three abilities are constructed for him: a 'healer' class ability, a 'troll' racial ability, and a 'fire' elemental ability. Each of these is individually and thematically named. Currently, each can carry one Effect, explained below, of relatively simple types. I have plans to integrate special Effects that run unique functionality. For example, the Tank Ability 'Guard' currently just buffs Vitality because that's the closest I could get to its real intended functionality. In future implementations, 'Guard' will provide a damage shield that absorbs a certain amount of damage until all of its protection has been eaten away by attacks.

Effects
-------

Abilities resolve their functions through special objects called Effects. Straight damage abilities are resolved through the 'damage' Effect in the same way that 'dot', 'hot', 'buff', 'debuff', and 'heal' Effects are resolved. Combatants will have functionality to understand and apply Effects appropriately, without any of the Combatants needing to know others' stats or pass their own around. All of the information required for damage, healing, buffs, and debuffs is packaged and sent separately from everything else. 

Current Work
============

 * Polish the message log so it's readable
 * Make some kind of display function _somewhere_ to begin laying the Combatants and their info out visually
 * Clean up config.json so the Ability -> Effect relationship is more clear
 * Making sure buffs and debuffs actually modify stats
 * Adding stat-based damage modifiers

Future Plans
============

 * **More elements and races.** Poison might be a good element, and I'm sure I can come up with a poison-specific race to go along with it
 * **Element-based weaknesses/strengths** that modify damage. As it is now, there are uneven groupings (4 natural elements, 2 spiritual elements, 2 balance elements, and 2 internal elements). I could adopt the standard 5 Chinese elements to replace the natural ones I have (wood/life, metal/air, earth, fire, water/ice), which have standard 'better-thans' and 'weaker-tos'. Adding elements isn't an issue - adding them with respect to all previously added elements is a little tougher.
 * **Beasts!** I want to fight not just humanoid Combatants, but Beasts. It's fair to say that Bears and Bee Swarms don't follow the same rules, archetypes, or even elements as Combatants, so a whole new object will need to be made for them.
 * **Effects with special functions.** I had attempted to start with this feature, but soon found that it would be better to get it working with simple Effects (heal, damage, dot, hot, buff, debuff). At the very least, each archetype-based Ability will have a special Effect available only to that archetype. My most likely solution will be to add a function to the Combatant prototype that will have an object containing functions for each special rule. So, `Combatant.specialEffect('guard', effect)` would run the 'guard' special function based on the Effect it's given. I would rather that be contained in the Effect, but since the results of the special function will be entirely within the Combatant, it doesn't make sense to have the function run externally.
 * **Useful stats and secondary stats.** Right now, stats are mostly for show, with the exception of Speed, which affects `Battle.turnOrder`. Naturally, Abilities will be tied to some combination of stats to calculate their damage, and the Combatant's defense against that damage. I would also like to have secondary stats like Dodge, Parry, and Crit, because those provide more flavor to the game.
 * **Combatant "Quality".** Just to spice things up more, I would like to add another layer to Combatants: quality. This will take the form of a descriptor that has a direct modification to their behavior and stats. This can be as simple as "slow", which lowers speed, or "veteran", which increases a bunch of stats. In addition to these, I'd like to add descriptors that have no benefit besides flavor text, e.g. "old", "purple", "bad-smelling", etc. 
 * **Armor and weapons.** I'm on the fence about this one, but I've thought about adding Armor and Weapons to the game as randomized qualities passed to the Combatant constructor. These will probably operate on a secondary stat level, like Attack and Defense, but will have other logical stat changes (plate armor lowers Speed, for example). Armor will not get an Ability assigned to it, but Weapon probably will.
 * **Sprites!** Given that Combatants are composed of layers of distinct qualities, a set of layered, transparent sprite images seems appropriate. To go along with these, backgrounds, Ability effects (explosions, etc), and status icons. 
 * **Large scale battles.** I would probably add a division above the party (faction[party1, partyN], faction[party1, partyN]) that can hold a specific number of parties. At this point, I would like to add an "aggro" system so that battles with multiple teams will swing as each faction's attention is drawn between its enemies. I can't comfortably do this without reducing the footprint of some things, so each individual object doesn't have to carry around so much information.

Running ff_sim
==============

Drop all of the files into a directory, preferably on a web server, or in an apache/xampp htdocs folder. Launch _index.htm_, and open your browser's Developer Console (usually f12). Currently, an overview of the Battle is printed to the Console. This overview contains the Combatants, their stats, abilities, and a test of what ability they would choose if it were their turn. Below that is the current turn order, which is a list of the combatants sorted by their speed, and below that the current combatant's object.

On the page itself, there is a button that begins the battle. Below that are separate areas for the main battle log and each character's output. 

This report is just for debugging purposes, and does not represent the final product.
