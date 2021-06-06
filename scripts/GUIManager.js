class GUIManager{

	static selectedObject = null;
	static start(){

	}

	static update(){

	}

	static draw(){
		//if(mouseIsPressed){
			if(GUIManager.selectedObject){
				push();
				textAlign(CENTER);
				text(GUIManager.selectedObject.type, GUIManager.selectedObject.posOnScreen.x, GUIManager.selectedObject.posOnScreen.y - 30);
				pop();
			}
		//}
	}
}