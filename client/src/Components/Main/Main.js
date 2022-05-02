import React from 'react'
import { Button, Container } from 'react-bootstrap';
import {Link} from 'react-router-dom';
import Doctor from "../../assets/main.svg";
import './Main.css';


const Main = () => {
    return (
        <div className='main'>
            <Container style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding:"20px 0px" }}>
                <img src={Doctor} alt="doctor-img" className='main__image' />
                <div style={{ margin: "auto", marginTop: "50px", textAlign:"center" }}>
                    <p className="main__para">The go to app for doctors and patients. Book your appointments securely and easily.</p>
                    <button className='main__button'><Link className="main__link" to="/login?show=true">GET STARTED</Link></button>
                </div>

            </Container>
        </div>
    )
}

export default Main
