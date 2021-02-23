'use strict'


{
    document.getElementById("score");
    //スコア初期値
    let linec = 1;
    //落ちるスピード
    const game_speed = 300;
    //フィールドサイズ
    const  fieldCol = 10;
    const  fieldRow = 20;

    //ブロック一つのサイズ
    const blocksize = 30;

    //スクリーンサイズ
    const screenW = blocksize * fieldCol;
    const screenH = blocksize * fieldRow; 

    //テトロミノのサイズ
    const tetrosize = 4;

    // con.fillStyle = 'red';
    // con.fillRect( 0,0, blocksize,blocksize);

    const tetro_colors = [
        "#000",			//0空
        "#6CF",			//1水色
        "#F92",			//2オレンジ
        "#66F",			//3青
        "#C5C",			//4紫
        "#FD2",			//5黄色
        "#F44",			//6赤
        "#5B5"	
    ];

    

    //テトロミノ本体
    
        const tetrotypes = [
            [],
    
            [
                [0,0,0,0 ],
                [1,1,1,1 ],
                [0,0,0,0 ],
                [0,0,0,0 ]
            ],
            [
                [0,1,0,0 ],
                [0,1,0,0 ],
                [0,1,1,0 ],
                [0,0,0,0 ]
            ],
            [
                [0,0,1,0 ],
                [0,0,1,0 ],
                [0,1,1,0 ],
                [0,0,0,0 ]
            ],
            [
                [0,1,0,0 ],
                [0,1,1,0 ],
                [0,1,0,0 ],
                [0,0,0,0 ]
            ],
            [
                [0,0,0,0 ],
                [0,1,1,0 ],
                [0,1,1,0 ],
                [0,0,0,0 ]
            ],
            [
                [0,0,0,0 ],
                [0,1,1,0 ],
                [1,1,0,0 ],
                [0,0,0,0 ]
            ],
        ];

        
        //初期位置
        const start_x = fieldCol/2 - tetrosize/2;
        const start_y = 0;
        //テトロミノ本体
        let tetro;
        //テトロミノの形
        let tetro_t;
        
        //テトロミノの座標
        let tetro_x = start_x;
        let tetro_y = start_y;
   
        //フィールド本体
        let field = [];
        
        //ゲームオーバー    
        let over = false;
        
        let can = document.getElementById('can');
        let con = can.getContext('2d');
        can.field="white";

    can.width = screenW;
    can.height = screenH;
    can.style.border = "4px solid #555";

    tetro_t = Math.floor(Math.random() * (tetrotypes.length-1))+1;
    tetro = tetrotypes[ tetro_t ];

    init ();
    drawAll();

    setInterval( droptetro, game_speed);
    
    //初期化
    function init()
    {
        for(let y=0; y<fieldRow ; y++)
        {
            field[y] = [];
            for(let x=0; x<fieldCol ; x++)
            {
                field[y][x] = 0;
            }
        }
    }

    //ブロックを一つ描画する

    function drawBlock(x,y,c)
    {
        let px = x * blocksize;
        let py = y * blocksize;

        con.fillStyle= tetro_colors[c];
        con.fillRect(px,py,blocksize,blocksize);
        con.strokeStyle='black';
        con.strokeRect(px,py,blocksize,blocksize);
    }

    //フィールド表示する
    function drawAll(){
        con.clearRect(0,0,screenW,screenH);

        for(let y=0; y<fieldRow; y++)
         {
             for(let x=0; x<fieldCol; x++)
             {
                 if(field[y][x])
                 {
                    drawBlock(x,y,field[y][x]);
                 }
             }
         }

        for(let y=0; y<tetrosize; y++)
         {
             for(let x=0; x<tetrosize; x++)
             {
                 if(tetro[y][x])
                 {
                    drawBlock(tetro_x + x,tetro_y + y,tetro_t);
                 }
             }
         }
         if(over){
             let s = "GAME OVER";
             con.font = "40px 'MS ゴシック";
             let w = con.measureText(s).width;
             let x = screenW/2 - w/2;
             let y = screenH/2 - 20;
             con.lineWidth = 4;
             con.strokeText(s,x,y);
             con.fillStyle="white";
             con.fillText(s,x,y);  
         }

    }

    //ブロックの衝突判定
    function checkMove (mx,my,ntetro){
        if( ntetro == undefined ) ntetro = tetro;

        for(let y=0; y<tetrosize; y++)
        {
            for(let x=0; x<tetrosize; x++)
            {
                if(ntetro[y][x]){
                    let nx = tetro_x + mx + x;
                    let ny = tetro_y + my + y;

                    if( ny < 0||
                        nx < 0||
                        ny >= fieldRow ||
                        nx >= fieldCol ||
                        field[ny][nx] ){
                            return false;
                        }
                }
            }
        }   
        return true;
    }

    //テトロの回転
    function rotate(){
        let ntetro = [];

        for(let y=0; y<tetrosize; y++)
        {
            ntetro[y]=[];
            for(let x=0; x<tetrosize; x++)
            {
                ntetro[y][x] = tetro[tetrosize-x-1][y];
            }
        }   
       return ntetro;
    }

    //テトロを固定する
    function fixtetro(){
        for(let y=0; y<tetrosize; y++)
        {
            for(let x=0; x<tetrosize; x++)
            {
             if(tetro[y][x]){
                 field[tetro_y + y][tetro_x + x] = tetro_t;
             }
            }
        }   
    }
    //ラインが揃ったかチェックして消す
    function checkLine(){
        
        for(let y=0; y<fieldRow; y++){

            let flag = true;
            
            for(let x=0; x<fieldCol; x++){
                if( !field[y][x]){
                    flag = false; 
                    break;
                }
            }
            if (flag){
                score.textContent = "SCORE: " + linec++;
                for(let ny = y; ny > 0; ny--){
                    for(let nx = 0; nx < fieldCol; nx++){
                        field[ny][nx] = field[ny-1][nx];
                    }   
                }
            }
        }
    }

    //ブロックの落ちる処理
    function droptetro(){
        if(over)return;
        
        if( checkMove( 0, 1))tetro_y++;
        else
        {
            fixtetro();
            
            checkLine();
            
            tetro_t = Math.floor(Math.random() * (tetrotypes.length-1))+1;
            tetro = tetrotypes[ tetro_t ];
            tetro_x = start_x;
            tetro_y = start_y;
            
            if(!checkMove(0,0)){
                over=true;
            }
        }
        drawAll();
    }

    //キーが押された時の処理
     document.onkeydown = function(e){
         if(over)return;

         switch( e.keyCode ){
             case 37: //左
                if( checkMove( -1, 0))tetro_x--;
                 
                 break;
             case 38: //上
            //  if( checkMove( 0, -1))tetro_y--;
                 
                 break;
             case 39://右
             if( checkMove( 1, 0))tetro_x++;
                 
                 break;
             case 40://下
             if( checkMove( 0, 1))tetro_y++;
                 
                 break;
             case 32://スペース
                 let ntetro = rotate();
                 if( checkMove (0,0,ntetro))tetro = ntetro;
                 break;

         }
         drawAll();
     }
}
