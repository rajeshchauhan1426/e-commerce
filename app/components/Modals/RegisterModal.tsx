'use client';

import axios from 'axios';
import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { useState } from 'react';
import Modal from './Modal';
import Heading from '../Heading';
import Input from '../Input/Input';
import { toast } from 'react-hot-toast';
import Button from '../Button';
import useRegisterModal from '../hooks/useRegisterModel'; 
import useLoginModal from '../hooks/useLoginModel';
import { signIn } from 'next-auth/react';

const RegisterModal = () => {
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
            email: '',
            password: '',
        },
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        axios.post('/api/register', data)
            .then(() => {
                toast.success('Registration successful!');
                registerModal.onClose();
            })
            .catch(() => {
                toast.error('Something went wrong. Please try again.');
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    

    const bodyContent = (
        <div className='flex flex-col gap-4'>
            <Heading 
                title='Welcome to A Revamping Relation'
                subtitle='Create an Account'
            />
            <Input
                id='email'
                label='Email'
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
            <Input
                id='name'
                label='Name'
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
    );

    const footerContent = (
        <div>
            <hr />
            <Button
                outline
                label={isLoading ? 'Loading...' : 'Continue with Google'}
                icon={FcGoogle}
                onclick={() => signIn('google')}
                disabled={isLoading}
            />
            <Button
                outline
                label={isLoading ? 'Loading...' : 'Continue with Github'}
                icon={AiFillGithub}
                onclick={() => signIn('github')}
                disabled={isLoading}
            />
            <div className='justify-center flex flex-row items-center gap-3'>
                <div>
                    Already have an account?
                </div>
                <div
                    onClick={() => {
                        registerModal.onClose();  // Close the register modal
                        loginModal.onOpen();      // Open the login modal
                    }} 
                    className='text-neutral-800 cursor-pointer hover:underline'>
                    Log in
                </div>
            </div>
        </div>
    );

    return (
        <Modal
            disabled={isLoading}
            isOpen={registerModal.isOpen}
            title="Register"
            actionLabel="Continue"
            onclose={registerModal.onClose} 
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
        />
    );
};

export default RegisterModal;
