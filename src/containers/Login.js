import React, { useState } from "react";
import { Auth } from "aws-amplify";
import Form from "react-bootstrap/Form";
import LoaderButton from "../components/LoaderButton";
import { useAppContext } from "../libs/contextLib";
import { useFormFields } from "../libs/hooksLib";
import { onError } from "../libs/errorLib";
import { useHistory } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import "./Login.css";

export default function Login() {
    const history = useHistory();
    const { userHasAuthenticated } = useAppContext();
    const [isLoading, setIsLoading] = useState(false);
    const [fields, handleFieldChange] = useFormFields({
        email: "",
        password: "",
    });

    function validateForm() {
        return fields.email.length > 0 && fields.password.length > 0;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setIsLoading(true);
        try {
            await Auth.signIn(fields.email, fields.password);
            userHasAuthenticated(true);
            history.push("/");
        } catch (e) {
            onError(e);
            setIsLoading(false);
        }
    }

    return (
        <div className="Login">
            <h2 className="text-center text-light">Login</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group size="lg" controlId="email">
                    <Form.Label className="text-light">Email</Form.Label>
                    <Form.Control
                        autoFocus
                        type="email"
                        value={fields.email}
                        onChange={handleFieldChange}
                        className="dark-input"
                    />
                </Form.Group>
                <Form.Group size="lg" controlId="password">
                    <Form.Label className="text-light">Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={fields.password}
                        onChange={handleFieldChange}
                        className="dark-input"
                    />
                </Form.Group>

                <LinkContainer to="/forget">
                    <h6 className="forgetPassword text-secondary">
                        <span>Forgot Password?</span>
                    </h6>
                </LinkContainer>
                <LoaderButton
                    block
                    size="lg"
                    type="submit"
                    isLoading={isLoading}
                    disabled={!validateForm()}
                    className="dark-button"
                >
                    Login
                </LoaderButton>
            </Form>
        </div>
    );
}
