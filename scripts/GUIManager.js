export default class GUIManager{
	static selectedObject = null;
	static elements = {
		buildingPopUp: null,
	}
	static start(){
		GUIManager.elements.buildingPopUp = document.getElementById("buildingPopUp");
	}

	static update(){

	}

	static draw(){
		//if(mouseIsPressed){
			if(GUIManager.selectedObject){
				push();
				textAlign(CENTER);
				//text(GUIManager.selectedObject.type, GUIManager.selectedObject.posOnScreen.x, GUIManager.selectedObject.posOnScreen.y - 30);
				pop();
				//console.log(GUIManager.elements.buildingPopUp);
				GUIManager.elements.buildingPopUp.style.display = 'block';
				GUIManager.elements.buildingPopUp.style.transform = 'translate('+ GUIManager.selectedObject.posOnScreen.x/* - GUIManager.elements.buildingPopUp.style.width/2*/ + 'px ,' + GUIManager.selectedObject.posOnScreen.y/* - GUIManager.elements.buildingPopUp.style.height/2*/ + 'px )'
				GUIManager.elements.buildingPopUp.innerText = GUIManager.selectedObject.type;
				//console.log(GUIManager.elements.buildingPopUp.style.transform, 'translate('+ GUIManager.selectedObject.posOnScreen.x + 'px ,' + GUIManager.selectedObject.posOnScreen.y + 'px )')
			} else {
				GUIManager.elements.buildingPopUp.style.display = "none";
			}
		//}
	}
}