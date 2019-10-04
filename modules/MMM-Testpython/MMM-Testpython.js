var Testpythons;
Module.register("MMM-Testpython", {

  requiresVersion: "2.1.0",

    defaults: {
      // Allow the module to force modules to be shown (if hidden and locked by another module ex. profile-switcher).
      allowForce: false,
      // Determines if the border around the buttons should be shown.
      
      
      animationSpeed: 500,
      // The default button 1. Add your buttons in the config.
    },
    start: function (){
        Testpythons = this;
        this.config.identifier = this.identifier;
    },

  getDom: function() {
    var element = document.createElement("div")
    element.className = "myContent"
    element.id="divid1"
    element.font = 4
    var subElement = document.createElement("p")
    subElement.innerHTML = "외모나이에 따라 "
    subElement.id = "clickid1"
    subElement.className = "click"
    subElement.style.fontSize = "2em"
    element.appendChild(subElement)
    var subelement2 = document.createElement("p")
    subelement2.innerHTML = "관광지를 추천 !"
    subelement2.id = "showage"
    subelement2.className = "showage"
    subelement2.style.fontSize = "2em"
    element.appendChild(subelement2)
    return element
  },
  

  notificationReceived: function(notification, payload, sender) {
    switch(notification) {
      case "DOM_OBJECTS_CREATED":
        //this.hide()
      break;
      case "camera_stop":
        var elem = document.getElementById("clickid1")
        var showage2 = document.getElementById("showage")
        showage2.innerHTML = "당신의 나이를 분석중입니다."  
      break;
      case "Modules All Change" :
      var ele2 = document.getElementById("showage")
      ele2.innerHTML =  "이 곳에 예상 나이가 표시됩니다."
      break;
      case "agecomplete":
        console.log("payload what"+payload)
        var payload3;
			  payload3=payload.toString().split(",");
			  var gender = payload3[0];
        var age = payload3[1];
        var modules = MM.getModules();
        var elemk = document.getElementById("clickid1")
        var elemk2 = document.getElementById("showage");
        elemk.innerHTML = "여기를 클릭하면 나이에 따른 여행코스를 추천해드립니다.";
        elemk2.innerHTML = "고객님의 예상나이는" + age + "살 입니다."; 
        elemk.addEventListener("click", () => {
          //Testpythons.sendNotification("gotoairport")
          console.log("airairairair")
          this.sendNotification("Testpython is done");
          
          modules[32].hide();
              
            
            
          
          
        })
      break;
      }
  },
  socketNotificationReceived: function(notification, payload) {
    switch(notification) {
      case "I_DID":
        console.log("Socket recevied 1: " + payload);
        var payload3;
        payload3=payload.toString().split(",");
        console.log("Socket recevied 1: " + payload3);
        var elemk = document.getElementById("clickid1")
        var elemk2 = document.getElementById("showage");
        var gender = payload3[0];
        console.log("Socket recevied 1: " + gender);
        var age = payload3[1];
        console.log("Socket recevied 1: " + age);
        var change; 
        elemk.innerHTML = "";
        elemk2.innerHTML = "고객님의 예상나이는" + age + "입니다.";   
      break
    }
  }
})

