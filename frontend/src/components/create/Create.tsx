"use client"
import React, { useState } from 'react'
import { FileUpload } from '../ui/file-upload'
import {
    Step,
    StepDescription,
    StepIcon,
    StepIndicator,
    StepNumber,
    StepSeparator,
    StepStatus,
    StepTitle,
    Stepper,
    useSteps,
    Box,
    Button,
    Switch,
    Flex,
    useToast
} from '@chakra-ui/react'
import VideoForm from './VideoForm'
import Upload from './Upload'
import Image from 'next/image'
import { useThemeColors } from '@/hooks/useThemeColors'


const steps = [
    { title: 'First', description: 'Video Details' },
    { title: 'Second', description: 'Date & Time' },
    { title: 'Third', description: 'Confirm Upload' },
]


const Create: React.FC = () => {
    const toast = useToast()
    const [file, setFile] = useState<File[]>([])
    const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>('')
    const [thumbnailFile, setThumbnailFile] = useState<File[]>([])
    const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string>('')
    const [publish, setPublish] = useState<boolean>(true)
    const [formData, setFormData] = useState({
        title: '',
        description: '',

    })
    const [canProceed, setCanProceed] = useState(false)

const {buttonBg} =    useThemeColors()

    const { activeStep, goToNext, goToPrevious, setActiveStep } = useSteps({
        index: 0,
        count: steps.length,
    })

    const handleFileUpload = (files: File[]) => {
        if (files.length > 0 && files[0].type.startsWith('video/')) {
            if (files[0].size > 100 * 1024 * 1024) {
                toast({
                    title: 'File too large',
                    description: 'Video size should not exceed 100MB',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                })
                return
            }

            setFile(files)
            const url = URL.createObjectURL(files[0])
            setVideoPreviewUrl(url)
            setCanProceed(true)
        }
    }

    const handleThumbnailUpload = (files: File[]) => {
        if (files.length > 0 && files[0].type.startsWith('image/')) {
            setThumbnailFile(files)
            const url = URL.createObjectURL(files[0])
            setThumbnailPreviewUrl(url)
        }
    }

    const handleFormDataChange = (data: { title: string; description: string }) => {
        setFormData(data);
        setCanProceed(true);
    }


    const handleNext = () => {
        if (canProceed) goToNext()
    }

    const renderStepComponent = () => {
        switch (activeStep) {
            case 0:
                return (
                    <div className="space-y-4">
                        {videoPreviewUrl && (
                            <div className="mb-4">
                                <video
                                    src={videoPreviewUrl}
                                    controls
                                    className="w-full max-h-[400px]"
                                />
                            </div>
                        )}
                    </div>
                )
            case 1:
                return (
                    <div className="space-y-6">
                        <VideoForm
                            onFormDataChange={handleFormDataChange}
                            initialData={formData}
                        />
                        <div className="mt-6">
                            <h3 className="text-lg font-medium mb-2">Upload Thumbnail</h3>
                            <FileUpload onChange={handleThumbnailUpload} type="image" />
                            {thumbnailPreviewUrl && (
                                <div className="mt-2">
                                    <Image
                                        src={thumbnailPreviewUrl}
                                        alt="Thumbnail preview"
                                        className="max-w-[200px] rounded-lg"
                                    />
                                </div>
                            )}
                        </div>

                        <Flex alignItems={'center'} gap={2} fontWeight={'semibold'} fontSize={'xl'}>Publish <Switch
                            colorScheme="blackAlpha"
                            isChecked={publish}
                            onChange={() => setPublish(prev => !prev)}
                        />
                        </Flex>
                    </div>
                )
            case 2:
                return <Upload
                    videoFile={file}
                    thumbnailFile={thumbnailFile}
                    formData={formData}
                    publish={publish}
                    onSuccess={() => setActiveStep(3)}
                />
            default:
                return null
        }
    }

    return (
        <div className="w-full mt-32 max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg p-6">
            {activeStep === 0 && <FileUpload onChange={handleFileUpload} />}

            <Stepper index={activeStep}>
                {steps.map((step, index) => (
                    <Step key={index}>
                        <StepIndicator>
                            <StepStatus
                                complete={<StepIcon />}
                                incomplete={<StepNumber />}
                                active={<StepNumber />}
                            />
                        </StepIndicator>

                        <Box flexShrink='0'>
                            <StepTitle>{step.title}</StepTitle>
                            <StepDescription>{step.description}</StepDescription>
                        </Box>

                        <StepSeparator />
                    </Step>
                ))}
            </Stepper>

            <div className="mt-6">{renderStepComponent()}</div>

            <div className="flex justify-between mt-4">
                {activeStep > 0 && <Button onClick={goToPrevious}>Previous</Button>}
                {activeStep < steps.length - 1 && (
                    <Button onClick={handleNext} isDisabled={!canProceed} bg={buttonBg}>Next</Button>
                )}
            </div>
        </div>
    )
}

export default Create
