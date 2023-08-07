import React, { useEffect, useState } from 'react';
import styles from './home.module.css';
import { ArrowRight } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import icon from '../../assets/designer.svg'
import Spinner from '../Spinner/spinner.jsx';
import { getAllProjects } from '../../firebase';
import ProjectModal from './ProjectModal/projectmodal.jsx';
import Footer from '../Footer/footer.jsx';

export default function Home(props){
    const navigate = useNavigate();
    const isAuth = props.auth ?  true : false; 
    // const userData = props.userData;

    // to check if the project is loaded or not
    const [projectLoaded, setProjectLoaded] = useState(false);
    // to store all the projects
    const [projects, setProjects] = useState([]);
    // whether to show the modal or not
    const [showProjectModal, setShowProjectModal] = useState(false);
    // to store the projects details in the modal
    const [projectDetails, setProjectDetails] = useState({});


    // there will be two cases when a user is either logged in or not
    // if the user is logged in he will be shown Manage else he will be shown lets get started
    // this will be achieved using states
    const handleClick = () => {
        if(isAuth){
            navigate('/account');
        }
        else{
        navigate('/login');
        }
    }
    
    // fetching user's project to display them on the home page
    const fetchAllProjects = async () => {
        const result = await getAllProjects();
        setProjectLoaded(true);
        if(!result){
            return ;
        }
        const tempProjects = [];
        result.forEach((doc) => {tempProjects.push({...doc.data(), pid: doc.pid})});
        setProjects(tempProjects);
    }

    const handleCardClick = (project) => {
        setShowProjectModal(true);
        setProjectDetails(project);
    }

    useEffect(() => {
        fetchAllProjects();
    }, []);

    return (
    <div className={styles.container}>
        {showProjectModal && (<ProjectModal onClose={() => setShowProjectModal(false)} details={projectDetails}/>)}
        {/* {isAuth && <div className={styles.header}>
                <p className={styles.heading}>
                    Welcome <span>{userData.name}</span>
                </p>

                <div className={styles.logout} onClick={handleLogout}>
                    <LogOut /> Logout
                </div>
            </div>} */}
        <div className={styles.headers}>
            <div className={styles.left}>
                <p className={styles.heading}>
                    Project Manager
                </p>
                <p className={styles.tagline}>
                    One stop solution for managing your software development projects!
                </p>
                <button onClick={handleClick}>{isAuth ? "Manage your Projects" : "Let's Get Started!"}{" "}
            <ArrowRight />{" "}</button>
            </div>
            <div className={styles.right}>
                <img src={icon} alt='icon'/>
            </div>
        </div>

        { isAuth && <div className={styles.body}>
        <p className={styles.title}>All Projects</p>
        <div className={styles.projects}>
        {projectLoaded ? (
            projects.length > 0 ? (
              projects.map((item) => (
                <div
                  className={styles.project}
                  key={item.pid}
                  onClick={() => handleCardClick(item)}
                >
                  <div className={styles.image}>
                    <img
                      src={
                        item.thumbnail ||
                        "https://www.agora-gallery.com/advice/wp-content/uploads/2015/10/image-placeholder-300x200.png"
                      }
                      alt="Project thumbnail"
                    />
                  </div>
                  <p className={styles.title}>{item.title}</p>
                </div>
              ))
            ) : (
              <p>No projects found</p>
            )
          ) : (
            <Spinner />
          )}
        </div>
      </div>}
      {/* <Footer /> */}
    </div>
    );
}