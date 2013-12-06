fs = require('fs');
_ = require('underscore');

/*
 * GET home page.
 */

function addNumber(sWord){
    var pos = Math.floor((Math.random() * sWord.length) + 1);
    var num = Math.floor((Math.random() * 10) + 1);
    sWord = sWord.slice(0,pos) + num + sWord.slice(pos);

    return sWord;
}

function addUCase(sWord){
    var charsNums = [];
    for(var i=65;i<91;i++)
        charsNums.push(i);

    var pos = Math.floor((Math.random() * sWord.length) + 1);
    var uChar = String.fromCharCode(charsNums[Math.floor((Math.random() * charsNums.length) + 1)]);
    sWord = sWord.slice(0,pos) + uChar + sWord.slice(pos);            

    return sWord;
}

function addSpecial(sWord){
    var charsNums = ['@','$','#','%','!','&','*','^','~'];
    var pos = Math.floor((Math.random() * sWord.length) + 1);
    var uChar = charsNums[Math.floor((Math.random() * charsNums.length) + 1)];
    sWord = sWord.slice(0,pos) + uChar + sWord.slice(pos);            
    return sWord;    
}

function cleanup(sWord){
    return sWord.trim().replace(/\s/g, '_');
}

function buildGenerationPipeline(strategies){
    var generatingPipeline = [];

    _.each(_.range(strategies.NumConfig), function(){ generatingPipeline.push(addNumber) });
    _.each(_.range(strategies.UpperConfig), function(){ generatingPipeline.push(addUCase) });
    _.each(_.range(strategies.SpecialConfig), function(){ generatingPipeline.push(addSpecial) });

    return _.shuffle(generatingPipeline);
}

function buildPassword(strategies, onComplete){
    var pwd = 'clever_clever';
    fs.readFile(__dirname + '/Diction.txt', 'utf8', function(err, data){
        var lines = data.split('\n');
        var randLine = Math.floor((Math.random() * lines.length) + 1);
        pwd = lines[randLine];

        var pipeline = buildGenerationPipeline(strategies);
        for(var i=0;i<pipeline.length;i++)
            pwd = pipeline[i](pwd);

        if (err) {
            return console.log(err);
        }

        onComplete(cleanup(pwd));
    });
}

exports.index = function(req, res){

  var strategies = {
        NumConfig: req.query.n || 0,
        UpperConfig: req.query.c || 0, 
        SpecialConfig: req.query.s || 0
  };

  buildPassword(strategies, function(pass){
      res.render('index', 
                    { 
                        title: 'Flustro', 
                        pword: pass, 
                        nums: strategies.NumConfig, 
                        ucases: strategies.UpperConfig,
                        specials: strategies.SpecialConfig
                    }
      );    
  });  
};