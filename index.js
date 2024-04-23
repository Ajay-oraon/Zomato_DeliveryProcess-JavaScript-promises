let isOrderAccepted= false;
let isValetFound=false;
let hasResturantSeenYourOrder
let restaurantTimer=null;
let valetTimer=null;
let isOrderDeliverd=false;
let valetDeliveryTimer


//Zomato App - Boot up/Power Up/Start
window.addEventListener('load',function(){
    document.getElementById('acceptOrder').addEventListener('click',function(){
        askRestaurantToAcceptOrReject();
       });
       this.document.getElementById('findValet').addEventListener('click',function () {
        askRestaurantToAcceptOrReject()
        
       })
       this.document.getElementById('deliverOrder').addEventListener('click',function () {
    setTimeout(() => {
            isOrderDeliverd=true;
    }, 2000);
        
       })
    checkIfOrderAcceptedFromRestaurant()
       .then(isOrderAccepted=>{
        console.log('update from restuarant -',isOrderAccepted);
        //step - Start preparing
        if(isOrderAccepted) startPreparingOrder();
        // step 3- Order preparing
        else alert('Sorry restuarant could not fullfill your order');
       })
       .catch(err=>{
        console.error(err);
       alert('Someting went Wrong! Please try again later');
       })
})

// step 1 -check wheather restaurant accepted order or not.
function askRestaurantToAcceptOrReject(){
    //callback
    setTimeout(()=>{
        isOrderAccepted=confirm('Should restaurant accept order?');
        hasResturantSeenYourOrder=true;
    },1000)
   
    
}

// step 2-check if Restaurant has accepted order

function checkIfOrderAcceptedFromRestaurant(){
     //Promise-resolve or reject
    return new Promise((resolve,reject)=>{
        restaurantTimer=setInterval(() => {
            console.log('checking if order accepted or not');
            if(!hasResturantSeenYourOrder) return;
            if(isOrderAccepted) resolve(true);
            else resolve(false);
            clearInterval(restaurantTimer)
        },2000);
    })
  
}

// step 4 -start preparing
function startPreparingOrder() {
    Promise.allSettled([
        updateOrderStatus(),
        updateMapView(),
        checkifValetAssigned(),
        startSearchingForValets(),
        checkIfOrderDelivered()

    ]).then(res=>{
        console.log(res);
        setTimeout(() => {
            alert('How was your food? Rate Your Food and Delivery Partner')
        }, 5000);
    })
    .catch(err=>{
        console.error(err);
    })
}

// Helper functions - Pure functions
function updateOrderStatus(){
    return new Promise((resolve,reject)=>{
        setTimeout(() => {
            document.getElementById('currentStatus').innerText= isOrderDeliverd ?"Order Delivered" : "Preparing Your order"
            resolve("status updated")
        }, 1000);

    })
}

function updateMapView() {
    // Fake delay to get Data
    return new Promise((resolve,reject)=>{
        setTimeout(() => {
    document.getElementById('mapview').style.opacity='1'
            resolve("map initialised")
        }, 1000);

    })
    
}

function startSearchingForValets() {
    // BED
    // bht complex operations:-
    /* 1. get all locations of nearby valets
        2.Sort the valets based on Shortes path of restuarant
        + to customer home
        3. Select the valet with shortest distance and minimum order
    */ 

// step 1 get valets
const valetsPromises=[];
for(let i=0;i<5;i++){
    valetsPromises.push(getRandomDriver());
}
console.log(valetsPromises);

Promise.any(valetsPromises)
.then(selectedValet=>{
    console.log('Selected a valet =>',selectedValet );
    isValetFound=true;
})
.catch(err=>{
    console.error(err);
})
    
}

function getRandomDriver() {
    // Fake Delay to get location data from riders
    return new Promise((resolve,reject)=>{
        const timeout=Math.random()*1000;
        setTimeout(() => {
            resolve('valet- ' + timeout)

        }, timeout);
    })
    
}

function checkifValetAssigned(params) {
    return new Promise((resolve,reject)=>{
        valetTimer=setInterval(() => {
            console.log('searching for valet');
            if(isValetFound){
                updateValetDetails();
                resolve('updated valet details')
                clearTimeout(valetTimer);
            }
        }, 1000);
    })
    
}

function checkIfOrderDelivered() {
    return new Promise((resolve,reject)=>{
        valetDeliveryTimer=setInterval(() => {
            console.log('is order delivered by valet');
            if(isOrderDeliverd){
                updateValetDetails();
                resolve('Order Delivered');
                clearTimeout(valetDeliveryTimer);
            }
        }, 1000);
    })
}

function updateValetDetails() {
    if (isValetFound){
        document.getElementById('finding-driver').classList.add('none');
        document.getElementById('found-driver').classList.remove('none');
        document.getElementById('call').classList.remove('none');
    }
}

// Promise- then,catch. callback-resolve,reject
// Types of promise-
// 1.Promise.all- calls all operation parallaly, if one fail all fail
// 2.Promise.allSettled-call one operation ,if one fail, it continues
// 3.Promise.race - first promise to complete
// 4.Promise.any - first promise to fullfill that is resolved/fullfilled