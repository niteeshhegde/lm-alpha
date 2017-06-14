import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase2 from 'firebase/app';
import * as firebase from 'firebase';
//import * as firebase from 'firebase/app';
import { environment } from '../../environments/environment';

@Injectable()
export class FirebaseService {
	employees: FirebaseListObservable<any[]>;
	owners: FirebaseObjectObservable<any[]>;
	empsignup: FirebaseObjectObservable<any[]>;
	managedEmps: FirebaseListObservable<any[]>;
	job: FirebaseObjectObservable<any[]>;
	displEmp: FirebaseObjectObservable<any>;
	displOwn: FirebaseObjectObservable<any>;
	folder:any;
	image1:any;
	addit:number;

	checkjobapply:any[];
	checkjobadd:any[];
	job_apply:jobApply;
	listings: FirebaseListObservable<any[]>;



  constructor(private afDb: AngularFireDatabase, public afAuth: AngularFireAuth) {
		this.folder="OwnerImages";
		this.checkjobapply=[];
		this.checkjobadd=[];

  }

  getAllEmployees(){
  	this.managedEmps = this.afDb.list('/ManagedEmps/'+this.afAuth.auth.currentUser.uid) as FirebaseListObservable<ManagedEmp[]>;
  	return this.managedEmps;
  }
	getManagerInfo(){

		this.displOwn = this.afDb.object('/Managers/'+this.afAuth.auth.currentUser.uid) as FirebaseObjectObservable<Owner>;
		return this.displOwn;
	}
  getManager(userId){
  	return this.afDb.object('/Managers/'+userId , { preserveSnapshot: true });
  }

  getEmployee(empUid){
 	console.log("Show emp uid: " + empUid);
  	this.displEmp = this.afDb.object('/Employees/'+empUid) as FirebaseObjectObservable<Employee>;
  	return this.displEmp;
  }

	getOwner(OwnerUid){

		this.displOwn = this.afDb.object('/Managers/'+OwnerUid) as FirebaseObjectObservable<Owner>;
		return this.displOwn;
	}





	addOwner(owner){

					this.afAuth.auth.createUserWithEmailAndPassword(owner.email, owner.password1).then((success) => {
					console.log(success);
					console.log(this.afAuth.auth.currentUser.uid);
					this.owners = this.afDb.object('/Managers/'+this.afAuth.auth.currentUser.uid) as FirebaseObjectObservable<Owner>;
					let storageRef = firebase.storage().ref();
					for(let selectedFile of [(<HTMLInputElement>document.getElementById('image_owner')).files[0]]){
						let path = `/${this.folder}/${this.afAuth.auth.currentUser.uid}/${selectedFile.name}`;
						let iRef = storageRef.child(path);
						iRef.put(selectedFile).then((snapshot) => {
							owner.image = selectedFile.name;
							owner.path = path;
							for(let selectedFile of [(<HTMLInputElement>document.getElementById('image_organisation')).files[0]]){
								let path = `/${this.folder}/${this.afAuth.auth.currentUser.uid}/${selectedFile.name}`;
								let iRef = storageRef.child(path);
								iRef.put(selectedFile).then((snapshot) => {
										owner.orgnaisation_image = selectedFile.name;
										owner.orgnaisation_image_path = path;
										this.owners.set(owner).then((success) => {
												this.afDb.object('/Managers/'+this.afAuth.auth.currentUser.uid+'/password1').remove();
												this.afDb.object('/Managers/'+this.afAuth.auth.currentUser.uid+'/password2').remove();
												alert("Profile was created successfully");
										});
								});
							}
						});
					}
				}).catch((error) => {
						alert(error.message);
						console.log(error);
					});
  }
	employeeSignup(employee){
					this.folder="EmployeeImages";
					this.afAuth.auth.createUserWithEmailAndPassword(employee.email, employee.password1).then((success) => {
					console.log(success);
					console.log(this.afAuth.auth.currentUser.uid);
					this.empsignup = this.afDb.object('/Employees/'+this.afAuth.auth.currentUser.uid) as FirebaseObjectObservable<EmployeeSignupInterface>;
					let storageRef = firebase.storage().ref();
					for(let selectedFile of [(<HTMLInputElement>document.getElementById('image_employee')).files[0]]){
						let path = `/${this.folder}/${this.afAuth.auth.currentUser.uid}/${selectedFile.name}`;
						let iRef = storageRef.child(path);
						iRef.put(selectedFile).then((snapshot) => {
							employee.image = selectedFile.name;
							employee.path = path;
							this.empsignup.set(employee).then((success) => {
									this.afDb.object('/Employees/'+this.afAuth.auth.currentUser.uid+'/password1').remove();
									this.afDb.object('/Employees/'+this.afAuth.auth.currentUser.uid+'/password2').remove();

									this.afDb.object('/AvailableEmps/'+this.afAuth.auth.currentUser.uid+'/name/').set(employee.name).then((success) =>{
								//alert("You have successfully applied for this job");
									}).catch((error) => {
										//alert("Job applied but request not sent: "+ error.message);
										console.log(error);
										});

									alert("Profile was created successfully");
							}).catch((error) => {
									alert(error.message);
									console.log(error);
								});
						});
					}
				}).catch((error) => {
						alert(error.message);
						console.log(error);
					});
  }
  addEmployee(employee){
  	console.log(this.afAuth.auth.currentUser.uid);
  	var fbApp2 =  firebase2.initializeApp(environment.firebase,"workerApp");
  	var fbAuth2 = fbApp2.auth();
  	var fbDb2 = fbApp2.database();

  	 fbAuth2.createUserWithEmailAndPassword(employee.email, "Welcome123").then((firebaseUser) => {
    	console.log("User " + firebaseUser.uid + " created successfully!");
     	fbDb2.ref('/Employees/'+firebaseUser.uid).set(employee).then((success) => {
     			fbAuth2.signOut();
				fbApp2.delete();
     	});
     	this.afDb.list('/ManagedEmps').update(this.afAuth.auth.currentUser.uid, {[firebaseUser.uid]:{'name':employee.name}})
		});
	console.log(this.afAuth.auth.currentUser.uid);
  }

 updateEmployee(employee){
    this.afDb.object('/Employees/'+this.afAuth.auth.currentUser.uid).update(employee);
  }


	updateOwner(owner){
		 this.owners = this.afDb.object('/Managers/'+this.afAuth.auth.currentUser.uid) as FirebaseObjectObservable<Owner>;

		 let storageRef = firebase.storage().ref();

		 if(((<HTMLInputElement>document.getElementById('image_organisation')).files[0])!=null){
			 for(let selectedFile of [(<HTMLInputElement>document.getElementById('image_organisation')).files[0]]){
				 let path = `/${this.folder}/${this.afAuth.auth.currentUser.uid}/${selectedFile.name}`;
				 let iRef = storageRef.child(path);
				 iRef.put(selectedFile).then((snapshot) => {
						 owner.orgnaisation_image = selectedFile.name;
						 owner.orgnaisation_image_path = path;
				 });
			 }
		 }

		 if(((<HTMLInputElement>document.getElementById('image_owner')).files[0])!=null){
			 for(let selectedFile of [(<HTMLInputElement>document.getElementById('image_owner')).files[0]]){
				 let path = `/${this.folder}/${this.afAuth.auth.currentUser.uid}/${selectedFile.name}`;
				 let iRef = storageRef.child(path);
				 iRef.put(selectedFile).then((snapshot) => {
						 owner.image = selectedFile.name;
						 owner.path = path;
				 });
			 }
		 }

		 			console.log(owner);
		     this.afDb.object('/Managers/'+this.afAuth.auth.currentUser.uid).update(owner);
				 //alert("Your profile is being updated ! Hold On!");
				 return owner;
	 }

	 getJobList(){
     this.listings = this.afDb.list('/Managers') as FirebaseListObservable<Organisation[]>;
     return this.listings;
   }

	getCompanyDetails(id){
		this.job = this.afDb.object('/Managers/'+id) as FirebaseObjectObservable<Organisation>
		return this.job;
	}

	checkJob(id){
		this.listings = this.afDb.list('/StaffingReq') as FirebaseListObservable<jobApply[]>;
		return this.listings;
	}

	applyJob(id){
		this.checkjobapply=[];
		this.addit=1;
		this.afDb.list("/UserReq/"+this.afAuth.auth.currentUser.uid+"/open/").take(1).subscribe(keys => {
		    keys.forEach(key => {
					this.checkjobapply.push(key);
				//console.log(this.checkjobapply.length);
						});
			});
			var that=this;
			var idto=id;
			setTimeout(function () {
				for(var i =0;i<that.checkjobapply.length;i++){
						that.job = that.afDb.object("/StaffingReq/"+that.checkjobapply[i].$key+"/reqInfo");
						that.job.take(1).subscribe(xy =>
							{
								var x =JSON.parse(JSON.stringify(xy));
								if(x.toId==id){
									that.addit=2;
								}else{
								}
							});
							if(that.addit==2){
								break;
							}
						}
    		}, 500);

			setTimeout(function () {
				if(that.addit==1){
					console.log(that.afAuth.auth.currentUser.uid);
					console.log(JSON.stringify({"toId":id,"fromId":that.afAuth.auth.currentUser.uid,"cancelled":"false"}));
					let updateMap = {};
					var postData = {"toId":id,"fromId":that.afAuth.auth.currentUser.uid,"cancelled":"false"};
					var newReqId = firebase.database().ref().child('StaffingReq').push().key;

					updateMap["/StaffingReq/"+ newReqId + "/reqInfo/"] = postData;
					updateMap["/UserReq/"+that.afAuth.auth.currentUser.uid+"/open/"+newReqId+"/"] = "true";

  					firebase.database().ref().update(updateMap).then((success) =>{
  						that.afDb.object('/UserReq/'+id+'/open/'+newReqId+"/").set("true").then((success) =>{
						alert("You have successfully applied for this job");
							}).catch((error) => {
								alert("Job applied but request not sent: "+ error.message);
								console.log(error);
								});
						}).catch((error) => {
							alert(error.message);
							console.log(error);
						});
					}
				else {
					alert("You have already applied for this job");
					return -1;
					}
			}, 1000);
	}


app2(id){
	this.checkjobapply=[];
	this.addit=1;
	this.afDb.list("/Vacancies/"+id+"/applicants/").take(1).subscribe(keys => {
			keys.forEach(key => {
				//this.checkjobapply.push(key);
				if(key.$key==this.afAuth.auth.currentUser.uid){
					this.addit=2;
				}

			//console.log(this.checkjobapply.length);
					});
		});
		var that=this;

		setTimeout(function () {
			if(that.addit==1){


	let updateMap = {};
	updateMap["/Vacancies/"+ id + "/applicants/"+that.afAuth.auth.currentUser.uid] = "true";
		firebase.database().ref().update(updateMap).then((success) =>{
			that.afDb.object("/UserReq/"+that.afAuth.auth.currentUser.uid+"/open/"+id).set("true").then((success) =>{
		alert("You have successfully applied for this job");
			}).catch((error) => {
				alert("Job applied but request not sent: "+ error.message);
				console.log(error);
				});
		}).catch((error) => {
			alert(error.message);
			console.log(error);
		});
	}else{
		alert("You have already applied for this job");
	}
},500);

}
	employeeApplyJob(id){
		this.checkjobapply=[];
		this.addit=1;
		this.afDb.list("/Vacancies/"+id+"/applicants/").take(1).subscribe(keys => {
				keys.forEach(key => {
					this.checkjobapply.push(key);

				//console.log(this.checkjobapply.length);
						});
			});
			var that=this;
			var idto=id;

			setTimeout(function () {
				for(var i =0;i<that.checkjobapply.length;i++){
						that.job = that.afDb.object("/StaffingReq/"+that.checkjobapply[i].$key+"/reqInfo");
						that.job.take(1).subscribe(xy =>
							{
								var x =JSON.parse(JSON.stringify(xy));
								if(x.toId==id){
									that.addit=2;
								}else{
								}
							});
							if(that.addit==2){
								break;
							}
						}
				}, 500);

			setTimeout(function () {
				if(that.addit==1){
					console.log(that.afAuth.auth.currentUser.uid);
					console.log(JSON.stringify({"toId":id,"fromId":that.afAuth.auth.currentUser.uid,"cancelled":"false"}));
					let updateMap = {};
					var postData = {"toId":id,"fromId":that.afAuth.auth.currentUser.uid,"cancelled":"false"};
					var newReqId = firebase.database().ref().child('StaffingReq').push().key;

					updateMap["/StaffingReq/"+ newReqId + "/reqInfo/"] = postData;
					updateMap["/UserReq/"+that.afAuth.auth.currentUser.uid+"/open/"+newReqId+"/"] = "true";

						firebase.database().ref().update(updateMap).then((success) =>{
							that.afDb.object('/UserReq/'+id+'/open/'+newReqId+"/").set("true").then((success) =>{
						alert("You have successfully applied for this job");
							}).catch((error) => {
								alert("Job applied but request not sent: "+ error.message);
								console.log(error);
								});
						}).catch((error) => {
							alert(error.message);
							console.log(error);
						});
					}
				else {
					alert("You have already applied for this job");
					return -1;
					}
			}, 1000);
	}





	check_if_free_employee(){
		//var x=0;

		return this.afDb.list("/AvailableEmps/"+this.afAuth.auth.currentUser.uid).take(1);


	}
	addJobRequirements(job_add){
	this.checkjobadd=[];
		this.addit=1;
		this.afDb.list("/UserReq/"+this.afAuth.auth.currentUser.uid+"/open/").take(1).subscribe(keys => {
				keys.forEach(key => {
					this.checkjobadd.push(key);
				console.log(this.checkjobadd.length);
						});
			});
			var that=this;
			setTimeout(function () {
				for(var i =0;i<that.checkjobadd.length;i++){
						that.job = that.afDb.object("/Vacancies/"+that.checkjobadd[i].$key+"/vacInfo");
						that.job.take(1).subscribe(xy =>
							{
								console.log(xy);
								var x =JSON.parse(JSON.stringify(xy));
								if(((x.job_gender==job_add.job_gender))&&((x.job_role)==(job_add.job_role))&&((x.job_address)==(job_add.job_address))){

									that.addit=2;
									//alert((x.gender==job_add.gender)+" "+ (x.job_role==job_add.job_role)+ " "+(x.address==job_add.address));
								}else{
								}
							});
							if(that.addit==2){
								break;
							}
						}
				}, 300);

				setTimeout(function () {
					if(that.addit==1){
						console.log(job_add);
						let updateMap = {};
						//var postData = {"toId":id,"fromId":that.afAuth.auth.currentUser.uid,"cancelled":"false"};
						var newReqId = firebase.database().ref().child('Vacancies').push().key;


						updateMap["/Vacancies/"+ newReqId + "/protectedInfo/manId"] =that.afAuth.auth.currentUser.uid;

							firebase.database().ref().update(updateMap).then((success) =>{
								let updateMap2 = {};
										updateMap2["/Vacancies/"+ newReqId + "/vacInfo/"] =job_add;
										updateMap2["/UserReq/"+that.afAuth.auth.currentUser.uid+"/open/"+newReqId+"/"] = "true";
										firebase.database().ref().update(updateMap2).then((success) =>{
											alert("You have successfully added the job");

										}).catch((error) => {
											alert(error.message);
											console.log(error);
										});

							}).catch((error) => {
								alert(error.message);
								console.log(error);
							});
						}
					else {
						alert("You have already added this job");
						return -1;
						}
				}, 1000);

	}


	getVacancies(){
		this.listings = this.afDb.list('/Vacancies') as FirebaseListObservable<Organisation[]>;
		return this.listings;
	}

}

interface Organisation{

	organisation_name?:string;
	exp?:string;
	num?:string;
	email?:string;

	registration_number?:string;
	organisation_type?:string;
	details?:string;

	image?:any;
	orgnaisation_image_path?:string;
	orgnaisation_image?:any;
	path?:string;
}



interface Owner{
	$key?:string;
	person_name?:string;
	organisation_name?:string;
	exp?:string;
	num?:string;
	email?:string;
	password1?:string;
	password2?:string;
	registration_number?:string;
	organisation_type?:string;
	details?:string;
	isManager?:string;
	image?:any;
	orgnaisation_image_path?:string;
	orgnaisation_image?:any;
	path?:string;
}

interface EmployeeSignupInterface{
	$key?:string;
	name?:string;
	num?:string;
	email?:string;
	password1?:string;
	password2?:string;
	profession_type?:string;
	details?:string;
	isManager?:string;
	image?:any;

	path?:string;
}

interface Employee{
  $key?:string;
  name?: string;
	pos?: string;
	exp?: string;
	num?: string;
	email?: string;
	uid?: string;
	sal?: string;
	loy?: string;
	csa?: string;
	clen?: string;
	act?: string;
	comm?: string;
}

interface ManagedEmp{
  	$key?:string;
  	name?:string;
}
interface jobApply{
	reqInfo: {
		fromId?: any;
		toId?: any;
	 	cancelled?: string;
	},
	result: {
	 	accepted?: string;
	    rejected?: string;
	}
}
