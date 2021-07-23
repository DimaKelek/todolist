import React from 'react'
import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    Grid,
    IconButton,
    TextField,
    Tooltip
} from '@material-ui/core'
import {useFormik} from "formik";
import {useDispatch, useSelector} from "react-redux";
import {AppStateType} from "../../store/store";
import {Redirect} from "react-router-dom";
import {login} from "../../store/auth-reducer";
import Paper from '@material-ui/core/Paper';
import S from "./Login.module.css";
import {Fingerprint, Info} from "@material-ui/icons";

type FormikErrorType = {
    email?: string
    password?: string
    rememberMe?: boolean
}
export const Login = () => {
    const isLoggedIn = useSelector<AppStateType, boolean>(state => state.auth.isLoggedIn)
    const dispatch = useDispatch()
    const [open, setOpen] = React.useState(false);

    const text = `Test Email: free@samuraijs.com Test Password: free`
    const handleTooltip = () => {
        setOpen(!open);
    };

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false
        },
        validate: (values) => {
            const errors: FormikErrorType = {};
            if (!values.email) {
                errors.email = 'Email is equired';
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = 'Invalid email address';
            }
            if (!values.password) {
                errors.password = 'Password is equired';
            } else if (values.password.length < 6) {
                errors.password = 'Password has been 6+ symbols';
            }
            return errors;
        },
        onSubmit: values => {
            dispatch(login(values))
            formik.resetForm()
        },
    })

    if (isLoggedIn) {
        return <Redirect to={"/"}/>
    }
    return (
        <Grid container className={S.login_container}>
            <Paper elevation={6} className={S.paper}>
                <Grid item xs={4}>
                    <div className={S.testData}>
                        <Tooltip
                            PopperProps={{
                                disablePortal: true,
                            }}
                            open={open}
                            disableFocusListener
                            disableHoverListener
                            disableTouchListener
                            title={text}
                            onBlur={handleTooltip}
                            placement="right-start"
                        >
                            <IconButton onClick={handleTooltip}>
                                <Info/>
                            </IconButton>
                        </Tooltip>
                    </div>
                    <form onSubmit={formik.handleSubmit} className={S.item}>
                        <FormControl>
                            <div className={S.title}>
                                <h2>Login</h2>
                                <Fingerprint/>
                            </div>
                            <FormGroup>
                                <div className={S.field}>
                                    <TextField
                                        label="Email"
                                        margin="normal"
                                        {...formik.getFieldProps("email")}
                                        onBlur={formik.handleBlur}
                                        helperText={formik.errors.email}
                                        error={formik.touched.email && !!formik.errors.email}
                                    />
                                </div>
                                <div className={S.field}>
                                    <TextField
                                        type="password"
                                        label="Password"
                                        margin="normal"
                                        {...formik.getFieldProps("password")}
                                        helperText={formik.errors.password}
                                        error={formik.touched.password && !!formik.errors.password}
                                    />
                                </div>
                                <FormControlLabel
                                    label={'Remember me'}
                                    control={<Checkbox
                                        color={"primary"}
                                        {...formik.getFieldProps("rememberMe")}
                                    />}
                                    className={S.checkbox}
                                />
                                <Button type={'submit'} variant={'contained'} color={'primary'}>Login</Button>
                            </FormGroup>
                        </FormControl>
                    </form>
                </Grid>
            </Paper>
        </Grid>
    )
}
