'use client';

import { signIn } from 'next-auth/react';
import axios from 'axios';
import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import {
    FieldValues,
    SubmitHandler,
    useForm
} from 'react-hook-form';
import useRegisterModal from '../hooks/useRegisterModel'; // Fixed typo in import
import { useState } from 'react';
import Modal from './Modal';
import Heading from '../Heading';
import Input from '../Input/Input';
import { toast } from 'react-hot-toast';
import Button from '../Button';
import useLoginModal from '../hooks/useLoginModel';
import { useRouter } from 'next/navigation';

const LoginModal = () => {
    const router = useRouter();
    const registerModal = useRegisterModal();
    const loginModal = useLoginModal();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            password: '',
        },
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        signIn('credentials', {
            ...data,
            redirect: false,
        })
        .then((callback) => {
            setIsLoading(false);

            if (callback?.ok) {
                toast.success('Logged in');
                router.push('/');
                loginModal.onClose();
            } else {
                // If the user is not found or invalid credentials, show error
                toast.error(callback?.error || 'User not found');
            }
        })
        .catch((error) => {
            setIsLoading(false);
            toast.error('An error occurred. Please try again.');
        });
    };

    // Function to handle OAuth login for Google and GitHub
    const handleOAuthLogin = async (provider: string) => {
        const result = await signIn(provider, { redirect: false });
        if (result?.error) {
            toast.error('Login failed. Please try again.');
        } else if (result?.ok) {
            toast.success(`Logged in with ${provider}`);
            router.push('/');
            loginModal.onClose();
        }
    };

    const bodyContent = (
        <div className='flex flex-col gap-4'>
            <Heading 
                title='Welcome back'
                subtitle='Login to your Account'/>
            <Input
                id='email'
                label='Email'
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
            <Input
                id='password'
                label='Password'
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
        </div>
    )

    const footerContent = (
        <div>
            <hr/>
            <Button
                outline
                label={isLoading ? 'Loading...' : 'Continue with Google'}
                icon={FcGoogle}
                onclick={() => handleOAuthLogin('google')} 
                disabled={isLoading}
            />
            <Button
                outline
                label={isLoading ? 'Loading...' : 'Continue with Github'}
                icon={AiFillGithub}
                onclick={() => handleOAuthLogin('github')} 
                disabled={isLoading}
            />
            <div className='justify-center flex flex-row items-center gap-3'>
                <div>
                    Don't have an Account?
                </div>
                <div
                    onClick={() => {
                        loginModal.onClose(); // Close the LoginModal
                        registerModal.onOpen(); // Open the RegisterModal
                    }} 
                    className='text-neutral-800 cursor-pointer hover:underline'>
                    Sign up
                </div>
            </div>
        </div>
    )

    return (
        <Modal
            disabled={isLoading}
            isOpen={loginModal.isOpen}
            title="Login"
            actionLabel="Continue"
            onclose={loginModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
        />
    );
};

export default LoginModal;
