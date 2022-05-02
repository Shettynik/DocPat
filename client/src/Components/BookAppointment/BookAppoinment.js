import { Container, Button, Spinner, Form, Row, Col } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import './BookAppoinment.css';
import { useSelector, useDispatch } from 'react-redux';
import { selectActiveUser } from '../../features/userSlice';
import { axiosInstance } from '../../AxiosSetup';
import { removeAlertMessage, setSuccessAlert, setErrorAlert } from '../../features/alertSlice';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import { useLocation } from 'react-router-dom';

const BookAppoinment = ({ history }) => {
    const location = useLocation();
    const [firstname, setfirstname] = useState("");
    const [lastname, setlastname] = useState("");
    const [loading, setloading] = useState(false);
    const [doctorId, setdoctorId] = useState("");
    const [date, setdate] = useState("");

    const checkActiveUser = useSelector(selectActiveUser);
    const dispatch = useDispatch();

    const handleBooking = (e) => {
        console.log(e.target.value)
        const slot = e.target.value;
        setloading(true);
        const today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = "0" + dd.toString()
        }
        if (mm < 10) {
            mm = "0" + mm.toString()
        }
        const currentDate = yyyy.toString() + "-" + mm + "-" + dd;
        console.log(currentDate)
        if (date < currentDate) {
            dispatch(setErrorAlert({ errorAlert: 'Select appropriate date' }));
            setTimeout(() => {
                dispatch(removeAlertMessage())
                setloading(false)
            }, 5000)

            return
        }
        console.log("doctorId", doctorId)

        const time = today.getHours();
        if ((slot === "firstSlot" && time >= 12) || (slot === "secondSlot" && time >= 16) || (slot === "thirdSlot" && time >= 21)) {
            // setloading(false)
            dispatch(setErrorAlert({ errorAlert: 'It is not possible for you to attend this time slot! Kindly select a different time slot' }));

            setTimeout(() => {
                dispatch(removeAlertMessage())
                setloading(false)
            }, 5000)

            return
        }

        axiosInstance.post('/appointment/book', { firstname, lastname, id: doctorId, slot, date }).then(() => {
            setfirstname("");
            setlastname("");
            dispatch(setSuccessAlert({ successAlert: 'You have successfully booked an appointment!' }));
            setloading(false)
            setTimeout(() => {
                dispatch(removeAlertMessage())
            }, 7000)
        }).catch((error) => {
            console.log(error)
            dispatch(setErrorAlert({ errorAlert: "No slots available" }));
            setloading(false)
            setTimeout(() => {
                dispatch(removeAlertMessage())
            }, 7000)
        })
    }

    useEffect(() => {
        if (!checkActiveUser) {
            history.push("/home")
        }
        setdoctorId(new URLSearchParams(location.search).get('doctor'))
        console.log("doctorId", doctorId)
    }, [])

    return (
        <div className='book__appointment__main'>
            <Container style={{ marginTop: "50px", width:"50vw", textAlign: "center" }}>
                <h3 className='book__head' style={{fontSize:"2rem", fontWeight:"600", marginBottom:"20px"}}><BookOnlineIcon style={{paddingBottom:"5px", fontSize:"2rem"}} />  Book An Appointment</h3>
                {loading ? <span className="booking__spinner"><Spinner animation="border" style={{ marginRight: "20px" }} />Loading...</span> : <>
                    <Form>
                        <Form.Control style={{ marginBottom: "10px", backgroundColor: "#7577F6", borderRadius: "10px", border: "1px solid #07087D", padding: "10px 15px", color: "white" }} placeholder="Firstname of the patient" type="text" value={firstname} required onChange={(e) => { setfirstname(e.target.value) }} />
                        <Form.Control style={{ marginBottom: "20px", backgroundColor: "#7577F6", borderRadius: "10px", border: "1px solid #07087D", padding: "10px 15px", color: "white" }} placeholder="Lastname of the patient" type="text" value={lastname} onChange={(e) => { setlastname(e.target.value) }} />
                        <Form.Control style={{ marginBottom: "20px", backgroundColor: "#7577F6", borderRadius: "10px", border: "1px solid #07087D", padding: "10px 15px", color: "white" }} required placeholder="Date" type="date" value={date} onChange={(e) => { setdate(e.target.value) }} />
                        <h6 className="sub__heading">Select Your Preferred Slot</h6>
                        <div style={{ textAlign: "center" }} >
                            
                            <div><Button style={{ paddingLeft: "70px", paddingRight: "70px", margin: "5px 0px" }} type="submit" value="firstSlot" onClick={handleBooking} size="lg" variant="outline-success">9am - 12pm</Button></div>
                            <div><Button style={{ paddingLeft: "70px", paddingRight: "70px" }} type="submit" value="secondSlot" onClick={handleBooking} size="lg" variant="outline-warning">1pm - 4pm</Button></div>
                            <div><Button style={{ paddingLeft: "70px", paddingRight: "70px" }} type="submit" value="thirdSlot" onClick={handleBooking} size="lg" variant="outline-info">6pm - 9pm</Button></div>
                            
                        </div>
                    </Form></>

                }

            </Container>
        </div>
    )
}

export default BookAppoinment;