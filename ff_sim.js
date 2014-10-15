var config = new Configuration();
var battle;
var log;
setTimeout(function() {
	log = new Announcer();
	battle = new Battle();
	
}, 100);

$('#startBattle').addEventListener('click', function(event) {
	if (battle.inProgress) {
		battle.endBattle();
		$('#startBattle').innerHTML = 'Start Battle';
	} else {
		battle.startBattle();
		$('#startBattle').innerHTML = 'End Battle';
	}
});
