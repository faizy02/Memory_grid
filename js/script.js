/*
#############################################################################################
#############################################################################################
	***AUTHOR : FAIZAN SAJJAD***
	***COPYRIGHTS D-FAULT STUDIOS 2015***
#############################################################################################
#############################################################################################
*/
var gameAudio = {
	pickRight : new Audio('sounds/pickRight.wav'),
	pickWrong : new Audio('sounds/pickWrong.wav'),
	successClip : new Audio('sounds/successClip2.wav'),
	failureClip : new Audio('sounds/failureClip.wav')
};
// var pickRight = new Audio('sounds/pickRight.wav');
// var pickWrong = new Audio('sounds/pickWrong.wav');
// var successClip = new Audio('sounds/successClip2.wav');
// var failureClip = new Audio('sounds/failureClip.wav');
function init(levelNo, levelObj, scoreObj){
	var randNoList = [], 
	matrixArray = [];

	levelObj.level = ((levelNo > 9) ? 9 : levelNo),
	levelObj.totalBlocks = 0,
	levelObj.unknownBlocks = ((levelNo > 9) ? levelNo + 3 : levelNo + 2),
	levelObj.tries = 0,
	levelObj.correct = 0,
	levelObj.mistake = 0

	resetAll(scoreObj);
	startLevel(levelObj, randNoList, matrixArray, scoreObj);
}
function resetAll(scoreObj) {
	$('#matrix-box').empty();
	$('#global-stats > div:nth-child(1) > span').html('0');
	$('#global-stats > div:nth-child(3) > span').html(scoreObj.globalScore);
	$('#level-stats > div:nth-child(1) > span:nth-child(2)').html('0');
	$('#level-stats > div:nth-child(2) > span:nth-child(2)').html('0');
	$('#level-stats > div:nth-child(3) > span:nth-child(2)').html('0');
	if(scoreObj.globalScore > scoreObj.highScore){
		localStorage.setItem('score', scoreObj.globalScore);
		scoreObj.highScore = scoreObj.globalScore;
	}
}
	

function randomGenerator(levelObj, randNoList, matrixArray){
	for(var z = 0; z < levelObj.unknownBlocks;){
		var randomNo =  Math.floor(Math.random() * levelObj.totalBlocks);
		if (randNoList.indexOf(randomNo) === -1){
			matrixArray[randomNo] = 1;
			randNoList[z] = randomNo;
			z++;
		}
	}
}

function startLevel(levelObj, randNoList, matrixArray, scoreObj){
	
	updateLevel(levelObj.level);
	var matrixSize = levelObj.level + 2; // Just a number to store
	
	calculateBlocks(levelObj); // Number of blocks in the level and matrix width and height
	
	//levelObj.unknownBlocks = matrixSize; // Blocks user has to find

	// Draw the blocks to user
	drawBlocks(matrixArray, levelObj.totalBlocks, matrixSize);
	// Generate unknown blocks and assign 1's to matrixArray[randomNo]
	randomGenerator(levelObj, randNoList, matrixArray);
	// Bind function
	showToUser(randNoList, levelObj.unknownBlocks);
	setTimeout(function(){
		HideFromUser(randNoList, levelObj.unknownBlocks);
		$('.matrix-block').click(function(){
		var block = $(this);
		clickfunction(block, levelObj, randNoList, matrixArray, scoreObj);
		});
	}, 2000);

}

function calculateBlocks(levelObj) {
	var temp = 3;
	var matrixWidth, matrixHeight;
	var temp = temp + parseInt(levelObj.level/2);
	if (levelObj.level % 2 === 1) {
		levelObj.totalBlocks = temp * temp;
		matrixWidth = (temp * 47) + 35;
		matrixHeight = (temp * 47) + 35;
	}else if(levelObj.level % 2 === 0) {
		levelObj.totalBlocks = temp * (temp - 1);
		matrixHeight = (temp * 47) + 35;
		matrixWidth = ((temp - 1) * 47) + 35;
	}
	$('#matrix-box').css('height', matrixHeight + 'px');
	$('#matrix-box').css('width', matrixWidth + 'px');

}

function showToUser(randNoList, unknownBlocks){
	for(var i = 0; i < unknownBlocks; i++){
		$('div[data-number = "'+ randNoList[i] + '"]').removeClass('myhidden').addClass('shown');
	}
}
function HideFromUser(randNoList, unknownBlocks){
	for(var i = 0; i < unknownBlocks; i++){
		$('div[data-number = "'+ randNoList[i] + '"]').removeClass('shown').addClass('myhidden');
	}
}

function drawBlocks(matrixArray, noOfBlocks, matrixSize){
	for (var i = 0 ; i < noOfBlocks ; i++) {
		matrixArray[i] = 0;
		$('#matrix-box').append('<div class="matrix-block myhidden" data-number="' + i + '"><span><span class=""></span></span></div>');	
	}
}
function updateLevel(levelNo) {
	$('#global-stats > div:nth-child(1) > span').html(levelNo);
}
function updateScore(scoreObj) {
	$('#global-stats > div:nth-child(3) > span').html(scoreObj.globalScore);
}
function updateglobalScore(scoreObj) {
	scoreObj.scoreObj = scoreObj.scoreObj + 10;
}
function levelScoreAddition(scoreObj) {
	$('#levelScoreAdd > span').html("+" + scoreObj.levelScore);
	if($('#levelScoreAdd > span').hasClass('animated')) {
		$('#levelScoreAdd > span').addClass('fadeOut');
	}else {
		$('#levelScoreAdd > span').addClass('animated fadeOut');
	}
	setTimeout(function(){
		$('#levelScoreAdd > span').empty().removeClass('fadeOut');
	}, 2000);
	
}
function showModal(levelObj, check){
	if(check) {
		$('#modalTitle > span').removeClass('ion-close').addClass('ion-checkmark');
		$('#modalMessage > p').html('Well done');
		$('#modalNextMessage span').html(++levelObj.unknownBlocks);
		$('#modalTitle').removeClass('font-red').addClass('font-green');
		$('#modalMessage').removeClass('font-red').addClass('font-green');
		$('#afterLevelModal').modal('show');
	}else {
		$('#modalTitle > span').removeClass('ion-checkmark').addClass('ion-close');
		$('#modalMessage > p').html('Oops. Try again')
		if(levelObj.level === 1) {
			$('#modalNextMessage span').html(levelObj.unknownBlocks);
		}else {
			$('#modalNextMessage span').html(--levelObj.unknownBlocks);
		}
		$('#modalTitle').removeClass('font-green').addClass('font-red');
		$('#modalMessage').removeClass('font-green').addClass('font-red');
		$('#afterLevelModal').modal('show');
	}
}
function toggleVolume(){
    $('#volBtn').click(function(){
        $(this).toggleClass("btn-primary btn-danger");
        $(this).children().toggleClass("ion-android-volume-up ion-android-volume-off");
        for (var prop in gameAudio) {
        	if(gameAudio[prop].muted === true)
		    	gameAudio[prop].muted = false;
		    else
		    	gameAudio[prop].muted = true;
		}
    });
}

$(document).ready(function(){
	var scoreObj = {
		levelScore : 0,
		globalScore : 0,
		highScore : localStorage.getItem('score')
	};
	var levelObj = {
		level : 0,
		totalBlocks : 0,
		unknownBlocks : 0,
		tries : 0,
		correct : 0,
		mistake : 0
	};
	toggleVolume();
	init(1, levelObj, scoreObj);

});

function clickfunction(block, levelObj, randNoList, matrixArray, scoreObj){
	if(block.hasClass('shown-green')){}else{
			var clicked = block.attr('data-number');
			if(matrixArray[clicked] === 1){
				gameAudio.pickRight.pause();
				gameAudio.pickRight.play();
				levelObj.correct++;
				block.removeClass('myhidden').addClass('shown-green');
				if(levelObj.correct === levelObj.unknownBlocks){
					gameAudio.successClip.play();
					$('.matrix-block').off('click');
					showModal(levelObj, true);
					setTimeout(function(){
						$('#afterLevelModal').modal('hide');
						scoreObj.globalScore += scoreObj.levelScore;
						updateScore(scoreObj.globalScore);
						levelScoreAddition(scoreObj);
						scoreObj.levelScore = 0;
						init(++levelObj.level, levelObj, scoreObj);
					}, 2000);
					
				}
				scoreObj.levelScore += 10;
			}else{
				gameAudio.pickWrong.play();
				block.removeClass('myhidden').addClass('shown-red');
				levelObj.mistake++;
				if(levelObj.mistake > 2 && levelObj.level > 1){
					gameAudio.pickWrong.pause();
					gameAudio.failureClip.play();
					$('.matrix-block').off('click');
					showToUser(randNoList, levelObj.unknownBlocks);
					setTimeout(function(){
						showModal(levelObj, false);
						setTimeout(function(){
							$('#afterLevelModal').modal('hide');
							init(--levelObj.level, levelObj, scoreObj);
						}, 2000);
					}, 1000);
				}else if(levelObj.mistake > 2){
					gameAudio.pickWrong.pause();
					gameAudio.failureClip.play();	
					$('.matrix-block').unbind('click');
					showToUser(randNoList, levelObj.unknownBlocks);
					setTimeout(function(){
						showModal(levelObj, false);
						setTimeout(function(){
							$('#afterLevelModal').modal('hide');
							init(levelObj.level, levelObj, scoreObj);
						}, 2000);
					}, 1000);
				}
			}
	}
}        
