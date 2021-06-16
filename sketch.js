//Create variables here
var  dog,dogImg, happyDog, database, foodS, foodStock;
var lastFed,fedTime,feed;
var addFood, foodObj; 
function preload()
{
  //load images here
  dogImg=loadImage("images/dogImg.png");
  happyDog=loadImage("images/dogImg1.png");
}

function setup() {
  createCanvas(1000,400);
  dog = createSprite(700,250,10,10);
  dog.addImage(dogImg);
  dog.scale = 0.2;
  
  database=firebase.database();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  foodObj=new Food();

  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
}


function draw() {  
  foodObj.display(); 
    background(46,139,87);
  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed: "+ lastFed%12 + "  PM",350,30);
  }else if(lastFed==0){
    text("Last Feed: 12 AM",350,30);
  }else{
    text("Last Feed: "+ lastFed + " AM",350,30);
  }
  drawSprites();
}

function readStock(data){
 foodS=data.val();
 foodObj.updateFoodStock(foodS);
}
function feedDog(){
  dog.addImage(happyDog);
  var food_stock_val = foodObj.getFoodStock();
  if(food_stock_val<=0){
    foodObj.updateFoodStock(food_stock_val * 0);
  }else{
    foodObj.updateFoodStock(food_stock_val -1);
  }
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}




