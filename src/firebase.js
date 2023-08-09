// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { addDoc, collection, doc, getDoc, getFirestore, setDoc, getDocs, query, where, deleteDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
const API_KEY = process.env.API_KEY;

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: "project-manager-1bd2d.firebaseapp.com",
  projectId: "project-manager-1bd2d",
  storageBucket: "project-manager-1bd2d.appspot.com",
  messagingSenderId: "740484992334",
  appId: "1:740484992334:web:33fe6499c22d96cb69621f",
  measurementId: "G-6817F47SHG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

// saving a new user in the db after successful signup
const updateUserDb = async (user, uid) => {
  if(typeof user !== "object"){
    return ;
  }
  const docRef = doc(db, "users", uid);
  await setDoc(docRef, {...user, uid});
};

// retriving user data from db
const getUserDb = async (uid) => {
  const docRef = doc(db, "users", uid);
  const result = await getDoc(docRef);
  // if the user doesn't exist in the db
  if(!result.exists()){
    return null;
  }
  return result.data();
};

// storing and retriving user image 
const storage = getStorage(app);

// uploading user image on cloud
// also showing the status of the upload 
// if any issue arises then this function will handle it
// this function will also provide a link to store it in storage function
const uploadImage = (file, progressCB, downloadUrl, error) => {
  if(!file){
    error("File not found!");
    return ;
  }

  // file description 
  const fileType = file.type;
  const fileSize = file.size/1024/1024;
  // if any thing other than image is uploaded
  if(!fileType.includes("image")){
    error("File must an image");
    return;
  }

  if(fileSize > 2) {
    errorCallback("File must smaller than 2MB");
    return;
  }

  const storageRef = ref(storage, `images/${file.name}`);

  const task = uploadBytesResumable(storageRef, file);

  // it is used for image upload
  // first callback is used for state change between any percentage upload and display the status of the image upload
  // second callback is called if any error occurs
  // the last callback is called only when the complete file is uploaded
  task.on('state_changed', (snapshot) => {
    console.log(snapshot);
    const progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
    progressCB(progress);
    
  }, (error) => {
    errorCallback(error.message);
  }, () => {
    getDownloadURL(storageRef)
      .then((url) => {
        downloadUrl(url);
      })
  });
}

// saving project data after successful validation
// while creating a new project we are not going to have unique id
const addProjectDb = async (project) => {
  if(typeof project !== "object"){
    return ;
  }
  const collectionRef = collection(db, "projects");
  await addDoc(collectionRef, {...project});
};

// to update a particular field in a project
const updateProjectDb = async (project, pid) => {
  if(typeof project !== 'object'){
    return ;
  }
  const docRef = doc(db, 'projects', pid);
  await setDoc(docRef, {...project});
}

// this function will be able to retrive all the projects in the projects collection
const getAllProjects = async () => {
  return await getDocs(collection(db, "projects"));
};

// to get all the projects by a user
const getAllProjectsForUser = async (uid) => {
  if(!uid){
    return ;
  } 
  const collectionRef = collection(db, "projects");
  const condition = where("refUser", "==", uid);
  const dbQuery = query(collectionRef, condition);

  return await getDocs(dbQuery);
};

// to delete a particular project of a user
const deleteProject = async (pid) => {
  const docRef = doc(db, "projects", pid);
  await deleteDoc(docRef);
};

export { app as default, 
          auth, 
          db, 
          updateUserDb, 
          getUserDb, 
          uploadImage, 
          addProjectDb, 
          updateProjectDb, 
          getAllProjects, 
          getAllProjectsForUser, 
          deleteProject 
        };