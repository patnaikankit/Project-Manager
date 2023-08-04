import React, { useEffect, useRef, useState } from "react";
import styles from "./account.module.css"
import Form from "../InputForm/form.jsx";
import { Camera, LogOut, Edit2, Trash, GitHub, Paperclip, Linkedin } from "react-feather";
import { signOut } from "firebase/auth";
import { auth, uploadImage, updateUserDb, getAllProjectsForUser, deleteProject } from "../../firebase";
import { Link, Navigate } from "react-router-dom";
import ProjectForm from "./Project-Form/projectform.jsx";
import { doc } from "firebase/firestore";
import Spinner from "../Spinner/spinner.jsx";

export default function Account(props){
    const userDetails = props.userDetails;
    const isAuth = props.auth;
    const imageSelector = useRef();

    // ------------------------------------------------------------------------------------------
    // State Change


    // to show the status of the image upload and to reset the progress status back to zero after a successful upload
    const [progress, setProgress] = useState(0);
    // to save the download url, upload it in the db and set it back to null after uploading it in profile for that particular user
    const [imageUrl, setImageurl] = useState(userDetails.profileImage || "");
    // to indicate that the uploading has started - there is a small delay after 100% upload is finished 
    const [uploadStart, setUploadStart] = useState(false);
    // to store the user data in the form and as well as show it them if they are already filled
    const [userData, setUserData] = useState({
        name: userDetails.name || "",
        title: userDetails.title || "",
        github: userDetails.github || "",
        linkedin: userDetails.linkedin || ""
    })
    // to disable the save button before the fields are filled
    const [showSaveButton, setShowSaveButton] = useState(false);
    // to disable the save button after the user clicks the save button
    const [saveButtonDisable, setSaveButtonDisable] = useState(false);
    // to display any issue which may arise in the profile section
    const [errMessage, setErrMessage] = useState(false);
    // to determine whether to show the project pop up box or not
    const [showProjectForm, setShowProjectForm] = useState(false);
    // to check if all the projects are loaded or not
    const [projectLoaded, setProjectLoaded] = useState(false);
    // to store all the projects in the profile
    const [projects, setProjects] = useState([]);
    // to signify that project form is opened to edit a project or not - the same form format is used for adding and editing a project
    const [editProjectModal, setEditProjectModal] = useState(false);
    // to handle the data while editing a project
    const [editProject, setEditProject] = useState({});

    
    // ------------------------------------------------------------------------------------------
    // Functions


    // logout logic
    const handleLogout = async () => {
        await signOut(auth);
    }

    // This function will prompt the file system box to pop up for image selection
    const handleImageClick = () => {
        imageSelector.current.click();
    }

    // now the image selected needs to be stored in the state change so that it can be displayed on the profile which will be done using a download url after the image has selected
    const handleImageChange = () => {
        const file = event.target.files[0];
        if(!file){
            return ;
        }
        setUploadStart(true);
        uploadImage(
            file,
            (progress) => {setProgress(progress)},
            (url) => {
                setImageurl(url);
                updateImagedb(url);
                setUploadStart(false);
                setProgress(0);
            },
            (err) => {
                console.error("Error -> ", err);
                setUploadStart(false);
            }
        );
    }

    // saving the image in the database
    const updateImagedb = async (url) => {
        await updateUserDb({...userData, profileImage: url}, userDetails.uid);
    }

    // the moment user starts filling an empty form the save button should appear
    const handleFormChange = (event, property) => {
        setShowSaveButton(true);
        setUserData((prev) => ({
            ...prev,
            [property]: event.target.value
        }))
    }

    // saving user details in the db
    const saveUserDatadb = async () => {
        // if the name is not provided at the time of signup
        if(!userDetails.name){
            setErrMessage("Name required!");
            return ;
        }
        setSaveButtonDisable(true);
        await updateUserDb({...userData}, userDetails.uid);
        setSaveButtonDisable(false);
        setShowSaveButton(false);
    }

    // fetching all the projects made by users
    const fetchAllProjects = async() => {
        const result = await getAllProjectsForUser(userDetails.uid);
        if(!result){
            setProjectLoaded(true);
            return true;
        }
        setProjectLoaded(true);
        let tempProjects = [];
        result.forEach((doc) => {
            // passing the project id as well so that the projects details can be altered as well
            tempProjects.push({...doc.data(), pid: doc.id});
        })
        setProjects(tempProjects);
    }

    // will be used to make changes in project
    const handleEditClick = (project) => {
        setEditProjectModal(true);
        setEditProject(project);
        setShowProjectForm(true);
    }

    // to delete a project
    const handleDeletion = async (pid) => {
        await deleteProject(pid);
        fetchAllProjects();
    }

    useEffect(() => {
        fetchAllProjects()
    }, [])


    return isAuth ? (
        <div className={styles.container}>
            {
                showProjectForm && <ProjectForm 
                                        onSubmission={fetchAllProjects()} 
                                        onClose={() => {setShowProjectForm(false)}} 
                                        uid={userDetails.uid} 
                                        isEdit={editProjectModal}
                                        default={editProject}
                                        /> 
            }
            <div className={styles.header}>
                <p className={styles.heading}>
                    Welcome <span>{userData.name}</span>
                </p>

                <div className={styles.logout} onClick={handleLogout}>
                    <LogOut /> Logout
                </div>
            </div>

            {/* this will allow the user to pick an image for profile */}
            <input ref={imageSelector} type="file" style={{display: "none"}} onChange={handleImageChange}/>
            <div className={styles.section}>
                <div className={styles.title}>
                    Your profile
                </div>
                <div className={styles.profile}>
                    <div className={styles.left}>
                        <div className={styles.image}>
                            <img src={imageUrl}  alt="Profile photo"/>
                            <div className={styles.camera} onClick={handleImageClick}>
                                <Camera />
                            </div>
                        </div>
                        {uploadStart ? (<p className={styles.progress}>
                        {progress === 100 ? "Uploading image..." : `${progress.toFixed(2)}% uploaded`}
                        </p>)
                        : ("")
                        }
                    </div>
                    <div className={styles.right}>
                        <div className={styles.row}>
                            <Form label="Name" 
                                  placeholder="John Doe"
                                  value={userData.name}
                                  onChange={(event) => {
                                    handleFormChange(event, "name");
                                }}
                            />
                            <Form 
                                label="Title" 
                                placeholder="eg. Full Stack Developer"
                                value={userData.title}
                                onChange={(event) => {
                                    handleFormChange(event, "title");
                                }}
                            />
                        </div>
                        <div className={styles.row}>
                            <Form 
                                label="Github" 
                                placeholder="Enter your github profile"
                                value={userData.github}
                                onChange={(event) => {
                                    handleFormChange(event, "github");
                                }}
                            />
                            <Form 
                                label="LinkedIn" 
                                placeholder="Enter your linkedin profile"
                                value={userData.linkedin}
                                onChange={(event) => {
                                    handleFormChange(event, "linkedin");
                                }}
                            />
                        </div>
                        <div className={styles.footer}>
                        <p className={styles.error}>{errMessage}</p>
                        {
                            showSaveButton &&  <button className={styles.saveButton} onClick={saveUserDatadb} disabled={saveUserDatadb}>Save Details</button>
                        }
                        </div>
                    </div>
                </div>
            </div>
            <hr />

            {/* Project section */}
            <div className={styles.section}>
                <div className={styles.projectsHeader}>
                    <div className={styles.title}>Your Projects</div>
                        <button className={styles.projectButton} onClick={() => setShowProjectForm(true)}>
                            Add Project
                        </button>
                </div>

                <div className={styles.projects}>
                {projectLoaded ? (
                    projects.length > 0 ? (
                    projects.map((item, index) => (
                        <div className={styles.project} key={item.title + index}>
                        <p className={styles.title}>{item.title}</p>

                        <div className={styles.links}>
                            <Edit2 onClick={() => handleEditClick(item)} />
                            <Trash onClick={() => handleDeletion(item.pid)} />
                            <Link target="_blank" to={`//${item.github}`}>
                            <GitHub />
                            </Link>
                            {item.link ? (
                            <Link target="_blank" to={`//${item.link}`}>
                                <Paperclip />
                            </Link>
                            ) : (
                            ""
                            )}
                        </div>
                        </div>
                    ))
                    ) : (
                    <p>No projects found</p>
                    )
                ) : (
                    <Spinner />
                )}
                </div>
            </div>
        </div>
    ) : (<Navigate to='/'/>
    );
}