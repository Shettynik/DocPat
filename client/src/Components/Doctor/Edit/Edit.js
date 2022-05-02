import React, { useEffect, useState } from 'react';
import { Container, Form, Image } from 'react-bootstrap';
import { axiosInstance } from '../../../AxiosSetup';
import { useDispatch } from 'react-redux';
import { removeAlertMessage, setErrorAlert, setSuccessAlert } from '../../../features/alertSlice';
import './Edit.css';
import Avatar from '../../../assets/avatar.svg';

const Edit = () => {
    const dispatch = useDispatch();
    const [sList, setsList] = useState([]);
    const [error, seterror] = useState("");
    const [specialization, setspecialization] = useState("");
    const [file, setfile] = useState(null);
    const [image, setimage] = useState({});
    const [info, setinfo] = useState({
        firstname: "",
        lastname: "",
        email: "",
        address: "",
        description: ""
    });

    const addSpecializations = () => {
        const check = sList.filter(s => s === specialization)
        if (check.length > 0) {
            seterror("You have already added that to the list");
            setTimeout(() => {
                seterror("")
            }, 7000)
            return
        }
        console.log(specialization)
        sList.push(specialization)
        setspecialization("")
        console.log(sList)
    }

    const removeSpecialization = (specialization) => {
        console.log(specialization)
        const output = sList.filter(s => s !== specialization);
        console.log("output", output)
        setsList(output);
    }

    const displayImage = (e) => {
        console.log(e.target.files[0])
        setfile(URL.createObjectURL(e.target.files[0]))
        setimage(e.target.files[0]);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        var data = new FormData();
        data.append("image", image);
        data.append("firstname", info.firstname);
        data.append("lastname", info.lastname);
        data.append("email", info.email);
        data.append("address", info.address);
        data.append("description", info.description);
        console.log(sList)
        data.append("specializations", sList);
        console.log(data)
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        axiosInstance.put('/doctor/edit', data).then(() => {
            console.log("Saved");
            dispatch(setSuccessAlert({ successAlert: "You have successfully saved your information" }));
            setTimeout(() => {
                dispatch(removeAlertMessage());
            }, 7000)
        }).catch((error) => {
            console.log("error", error)
            dispatch(setErrorAlert({ errorAlert: "Something went wrong please try again" }));
            setTimeout(() => {
                dispatch(removeAlertMessage());
            }, 7000)
        })
    }

    const getInfo = async () => {
        axiosInstance.get('/doctor/view').then((data) => {
            console.log("information", data.data)
            console.log(data.data.specializations[0])
            if (data.data.specializations[0]) {
                const array = data.data.specializations[0].split(',')
                setsList(array)
            }
            setfile(data.data.image)
            setinfo({ ...data.data })
            console.log(sList)
        }).catch((error) => {
            console.log(error)
        })
    }

    useEffect(() => {
        getInfo()
    }, []);

    return (
        <div className='doctor__edit'>
            <Container style={{ marginTop: "50px", width: "45vw" }}>
                <Form>
                    <div className='edit__profile__image'>
                        {file ? <Image src={file} style={{ width: "171px", height: "180px" }} roundedCircle /> : <Image src={Avatar} style={{ width: "171px", height: "180px" }} roundedCircle />}

                        <input className="file__input" type="file" name="image" onChange={(e) => { displayImage(e) }} />
                    </div>
                    <Form.Group className="view__form__group">
                        <Form.Label className='edit__form__label'>First Name</Form.Label>
                        <Form.Control style={{ backgroundColor: "#7577F6", borderRadius: "10px", border: "1px solid #07087D", padding: "10px 15px", color: "white" }} onChange={(e) => { setinfo({ ...info, firstname: e.target.value }) }} value={info.firstname} type="text" placeholder="Firstname" />
                    </Form.Group>
                    <Form.Group className="view__form__group">
                        <Form.Label className='edit__form__label'>Last Name</Form.Label>
                        <Form.Control style={{ backgroundColor: "#7577F6", borderRadius: "10px", border: "1px solid #07087D", padding: "10px 15px", color: "white" }} onChange={(e) => { setinfo({ ...info, lastname: e.target.value }) }} value={info.lastname} type="text" placeholder="Lastname" />
                    </Form.Group>
                    <Form.Group className="view__form__group">
                        <Form.Label className='edit__form__label'>Email Address</Form.Label>
                        <Form.Control style={{ backgroundColor: "#7577F6", borderRadius: "10px", border: "1px solid #07087D", padding: "10px 15px", color: "white" }} value={info.email} disabled type="text" placeholder="Email" />
                    </Form.Group>
                    <Form.Group className="view__form__group">
                        <Form.Label className='edit__form__label'>Short Description About Yourself</Form.Label>
                        <Form.Control style={{ backgroundColor: "#7577F6", borderRadius: "10px", border: "1px solid #07087D", padding: "10px 15px", color: "white" }} onChange={(e) => { setinfo({ ...info, description: e.target.value }) }} value={info.description} type="text" placeholder="Write a short description about yourself" />
                    </Form.Group>
                    <Form.Group className="view__form__group">
                        <Form.Label className='edit__form__label'>Address</Form.Label>
                        <Form.Control style={{ backgroundColor: "#7577F6", borderRadius: "10px", border: "1px solid #07087D", padding: "10px 15px", color: "white" }} onChange={(e) => { setinfo({ ...info, address: e.target.value }) }} value={info.address} type="text" placeholder="Address" />
                    </Form.Group>


                </Form>
                <Form.Group className="view__form__group">
                    <Form.Label className='edit__form__label'>Specializations</Form.Label>
                    <div className="specializations__form">
                        {error && <p style={{ color: "red" }}>{error}</p>}
                        <Form.Control style={{ backgroundColor: "#7577F6", borderRadius: "10px", border: "1px solid #07087D", padding: "10px 15px", color: "white" }} onChange={(e) => { setspecialization(e.target.value) }} value={specialization} type="text" placeholder="Specializations" />
                        <button onClick={addSpecializations} className="edit__add__btn">Add</button>
                    </div>
                    {sList && sList.map((s) => (
                        <button className="edit__list__btn" style={{ marginRight: "10px", marginTop: "10px" }}>{s}<span className="cross" onClick={() => { removeSpecialization(s) }}> X</span></button>
                    ))}
                </Form.Group>
                <div className='edit__main__btn'>
                    <button className="edit__save__btn" onClick={handleSubmit}>Save</button>
                </div>
            </Container>
        </div>
    )
}

export default Edit;