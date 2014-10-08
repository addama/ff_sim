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
==========

 * Races: human, dwarf, elf, halfling, troll, orc, giant
 
 * Archetypes: tank, healer, rangedInt, rangedDex, meleeStr, meleeDex
 
 * Elements: fire, ice, earth, air, holy, evil, life, death, physical, psychic
 
 * Genders: male, female
 
A combatant is created with these four qualities, each randomized. Races and Archetypes each have a layer of stats which can be zippered together (along with miscellaneous mods) into a singular stat. With the exception of Gender, each quality has a corresponding Ability. 

For example, let's create a new Combatant: `var gary = new Combatant('left', 0, 'healer', 'fire', 'troll', 'male')` The Combatant constructor recognizes that the combination of 'fire' element and 'rangedInt' archetype should be called a 'Pyromancer'. It also sees that Gary is both 'fire' element and 'troll' race, which it knows is called a 'fire troll'. This is displayed to the user as "Gary, Fire Troll Pyromancer".

Abilities
=========

When _Gary, Fire Troll Pyromancer_ is constructed, three abilities are constructed for him: a 'healer' class ability, a 'troll' racial ability, and a 'fire' elemental ability. Each of these is individually and thematically named. Currently, each can carry one Effect, explained below, of relatively simple types. I have plans to integrate special Effects that run unique functionality. For example, the Tank Ability 'Guard' currently just buffs Vitality because that's the closest I could get to its real intended functionality. In future implementations, 'Guard' will provide a damage shield that absorbs a certain amount of damage until all of its protection has been eaten away by attacks.

Effects
=======

Abilities resolve their functions through special objects called Effects. Straight damage abilities are resolved through the 'damage' Effect in the same way that 'dot', 'hot', 'buff', 'debuff', and 'heal' Effects are resolved. Combatants will have functionality to understand and apply Effects appropriately, without any of the Combatants needing to know others' stats or pass their own around. All of the information required for damage, healing, buffs, and debuffs is packaged and sent separately from everything else. 
