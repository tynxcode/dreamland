import { useEffect, useState } from 'react';
import ImageUploading from 'react-images-uploading';
import { Button, ButtonGroup, Divider, Grid, MenuItem, TextField, Typography, Box, CircularProgress, Modal } from '@mui/material';
import SubCard from 'ui-component/cards/SubCard';
import { useAddress } from 'contexts/address';
import { projectType } from '../constants/project'
import { useMutation } from '@apollo/client';
import axios from 'axios';
import { CloudName } from 'constants/cloudinary';
import { EDIT_PROJECT } from 'graphql/mutations/update';

const UpdateProject = ({ project, goBack }) => {
    const [formData, setFormData] = useState({
        projectName: "",
        description: "",
        address: {},
        investor: {
            name: "",
            establishYear: 2022,
            about: ""
        },
        information: {},
        virtual3DLink: null
    })
    const [isUploading, setIsUploading] = useState(false)

    const [images, setImages] = useState([]);
    const [utilities, setUtilities] = useState([])
    const [masterPlan, setMasterPlan] = useState([])
    const [selectedAddress, setSelectedAdress] = useState({
        province: undefined,
        district: undefined,
        ward: undefined
    })

    const [modal, setModal] = useState({
        message: '',
        active: false,
        success: false
    })

    const maxNumber = 10;

    const { provinces } = useAddress()

    const [edit, { data, error }] = useMutation(EDIT_PROJECT)

    useEffect(() => {
        const { _id, directLink, outstanding, actived, ...result } = project
        setFormData(result)
    }, [project])

    const onUploadImage = async () => {
        try {
            let formData = new FormData()

            const mediaImagePresets = await Promise.all(images.map(async image => {
                formData.append("file", image.file)
                formData.append("upload_preset", "projects")
                const { data } = await axios.post(`https://api.cloudinary.com/v1_1/${CloudName}/image/upload`, formData)
                return data?.secure_url
            }))

            const utilitiesPresets = await Promise.all(utilities.map(async (elm) => {
                formData.append("file", elm.image.file)
                formData.append("upload_preset", "projects")
                const { data } = await axios.post(`https://api.cloudinary.com/v1_1/${CloudName}/image/upload`, formData)
                return {
                    image: data?.secure_url,
                    title: elm.title
                }
            }))

            const masterPlanPresets = await Promise.all(masterPlan.map(async (elm) => {
                formData.append("file", elm.image.file)
                formData.append("upload_preset", "projects")
                const { data } = await axios.post(`https://api.cloudinary.com/v1_1/${CloudName}/image/upload`, formData)
                return {
                    image: data?.secure_url,
                    title: elm.title
                }
            }))

            return {
                mediaImagePresets,
                utilitiesPresets,
                masterPlanPresets
            }
        } catch (error) {
            return {
                mediaImagePresets: [],
                utilitiesPresets: [],
                masterPlanPresets: []
            }
        }
    }

    const onChange = (imageList, option) => {
        // option: 0 - pjImage; 1 - utilities; 2 - master plan
        if (option === 0) {
            setImages(imageList);
        }

        if (option === 1) {
            const result = imageList.map((el) => {
                if (el.image === undefined)
                    return {
                        image: el,
                        title: ''
                    }

                return el
            })
            setUtilities(result);
        }

        if (option === 2) {
            const result = imageList.map((el) => {
                if (el.image === undefined)
                    return {
                        image: el,
                        title: ''
                    }

                return el
            })
            setMasterPlan(result);
        }
    };

    const onTitleChange = (e, index, option) => {
        let { value } = e.target

        if (option === 1) {
            let items = utilities
            items[index].title = value
            setUtilities(s => [...items])
        }

        if (option === 2) {
            let items = masterPlan
            items[index].title = value
            setMasterPlan(s => [...items])
        }
    }

    const onOptionalRemove = (index, option) => {
        if (option === 1) {
            let items = utilities
            items.splice(index, 1)
            setUtilities(s => [...items])
        }

        if (option === 2) {
            let items = masterPlan
            items.splice(index, 1)
            setMasterPlan(s => [...items])
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsUploading(true)
        const { mediaImagePresets, utilitiesPresets, masterPlanPresets } = await onUploadImage()

        let updateData = {
            ...formData,
            media: {
                images: [...formData.media.images, ...mediaImagePresets]
            },
            utilities: [...formData.utilities, ...utilitiesPresets],
            masterPlan: [...formData.masterPlan, ...masterPlanPresets]
        }

        edit({
            variables: {
                id: project._id,
                data: updateData
            }
        })
    }

    const onDeleteImage = (index, option) => {
        if (option === 1) {
            let items = formData.utilities
            items.splice(index, 1)
            setFormData(s => ({ ...s, utilities: items }))
            return;
        }

        if (option === 2) {
            let items = formData.masterPlan
            items.splice(index, 1)
            setFormData(s => ({ ...s, masterPlan: items }))
            return;
        }

        let items = formData.media.images
        items.splice(index, 1)
        setFormData(s => ({ ...s, media: { ...s.media, images: items } }))
    }

    useEffect(() => {
        setIsUploading(false)
        if (data && !error) {

            setModal({
                message: "Ch???nh s???a th??nh c??ng !",
                active: true,
                success: true
            })
            goBack()
        }

        if (error) {
            setModal({
                message: "Ch???nh s???a th???t b???i !",
                active: true,
                success: false
            })
        }
    }, [data, error])

    const onCloseModal = () => {
        if (modal.success) {
            goBack()
        }

        setModal({
            message: '',
            active: false,
            success: false
        })
    }

    return (
        <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
                <Grid item xs={12} lg={12}>
                    <SubCard title="Ch???nh s???a d??? ??n">
                        <Grid container spacing={2}>
                            <Grid item xs={12} lg={6}>
                                <Box margin={"12px 0"}>
                                    <Typography variant='h4' marginBottom={1}>
                                        Th??ng tin b??i ????ng
                                    </Typography>
                                    <Divider />
                                    <TextField
                                        fullWidth
                                        label="T??n d??? ??n"

                                        variant="outlined"
                                        margin="normal"
                                        value={formData.projectName}
                                        onChange={e => setFormData(s => ({ ...s, projectName: e.target.value }))}

                                    />
                                    <TextField
                                        multiline
                                        minRows={24}
                                        name="description"

                                        fullWidth
                                        label="Gi???i thi???u d??? ??n"
                                        variant="outlined"
                                        margin="normal"
                                        value={formData.description}
                                        onChange={e => setFormData(s => ({ ...s, description: e.target.value }))}
                                    />
                                </Box>

                                <Box margin={"12px 0"}>
                                    <Typography variant='h4' marginBottom={1}>
                                        Nh?? ?????u t?? d??? ??n
                                    </Typography>
                                    <Divider />
                                    <Grid container marginBottom={4} spacing={1}>
                                        <Grid lg={6} xl={6} item>
                                            <TextField
                                                fullWidth
                                                label="T??n ch??? ?????u t??"

                                                variant="outlined"
                                                margin="normal"
                                                onChange={e => setFormData(s => ({ ...s, investor: { ...s.investor, name: e.target.value } }))}
                                                value={formData.investor.name}
                                            />
                                        </Grid>

                                        <Grid lg={6} xl={6} item>
                                            <TextField
                                                fullWidth
                                                label="N??m th??nh l???p"

                                                variant="outlined"
                                                margin="normal"
                                                onChange={e => setFormData(s => ({ ...s, investor: { ...s.investor, establishYear: Number(e.target.value) } }))}
                                                value={formData.investor.establishYear}
                                            />
                                        </Grid>
                                        <Grid lg={12} xl={12} item>
                                            <TextField
                                                fullWidth
                                                multiline
                                                label="Gi???i thi???u nh?? ?????u t??"

                                                minRows={6}
                                                variant="outlined"
                                                margin="normal"
                                                onChange={e => setFormData(s => ({ ...s, investor: { ...s.investor, about: (e.target.value) } }))}
                                                value={formData.investor.about}
                                            />
                                        </Grid>
                                        <Grid xs={12} lg={12} xl={12} item>
                                            <TextField
                                                fullWidth
                                                label="Link th???c t??? ???o 3D"
                                                value={formData.virtual3DLink}
                                                onChange={e => setFormData(s => ({ ...s, virtual3DLink: e.target.value }))}
                                                defaultValue={""}
                                                margin="normal"
                                            />
                                        </Grid>
                                        <Grid xs={12} lg={12} xl={12} item>
                                            <TextField
                                                fullWidth
                                                label="Link Google Maps"
                                                value={formData.googleMapsLink ?? ""}
                                                onChange={e => setFormData(s => ({ ...s, googleMapsLink: e.target.value }))}
                                                defaultValue={""}
                                                margin="normal"
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>
                            <Grid item xs={12} lg={6}>
                                <Box margin={"12px 0"}>
                                    <Typography variant='h4' marginBottom={1}>
                                        Th??ng tin ?????a ch???
                                    </Typography>
                                    <Divider />
                                    <Grid container marginBottom={4} spacing={1}>
                                        <Grid xs={12} xl={6} item>
                                            <TextField
                                                id="province"
                                                name='province'
                                                fullWidth
                                                label={formData.address?.province ?? "T???nh"}
                                                variant="outlined"
                                                margin="normal"
                                                value={formData.address?.province}
                                                select
                                                onChange={e => setFormData(s => ({ ...s, address: { ...s.address, province: e.target.value } }))}

                                            >
                                                {provinces.map((option, index) => (
                                                    <MenuItem key={index} value={option.name} onClick={() => setSelectedAdress(s => ({ ...s, province: option }))}>
                                                        {option.name}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>
                                        <Grid xs={12} xl={6} item>
                                            <TextField
                                                id="district"
                                                name='district'
                                                fullWidth
                                                label={formData.address?.district ?? "Qu???n/Huy???n"}
                                                variant="outlined"
                                                select
                                                value={formData.address?.district}
                                                onChange={e => setFormData(s => ({ ...s, address: { ...s.address, district: e.target.value } }))}
                                                margin="normal"
                                            >
                                                {selectedAddress.province?.districts.map((option, index) => (
                                                    <MenuItem key={index} value={option.name} onClick={() => setSelectedAdress(s => ({ ...s, district: option }))}>
                                                        {option.name}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>
                                        <Grid xs={12} xl={6} item>
                                            <TextField
                                                id="ward"
                                                name='ward'
                                                fullWidth
                                                label={formData.address?.ward ?? "X??/Ph?????ng"}

                                                variant="outlined"
                                                defaultValue={""}
                                                select
                                                value={formData.address?.ward}
                                                onChange={e => setFormData(s => ({ ...s, address: { ...s.address, ward: e.target.value } }))}
                                                margin="normal"
                                            >
                                                {selectedAddress.district?.wards.map((option, index) => (
                                                    <MenuItem key={index} value={option.name} onClick={e => setSelectedAdress(s => ({ ...s, ward: option }))}>
                                                        {option.name}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>
                                        <Grid xs={12} xl={6} item>
                                            <TextField
                                                id="street"
                                                name='street'
                                                fullWidth
                                                label="T??n ???????ng"

                                                variant="outlined"
                                                margin="normal"
                                                value={formData.address?.street}
                                                onChange={e => setFormData(s => ({ ...s, address: { ...s.address, street: e.target.value } }))}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                                <Box margin={"12px 0"}>
                                    <Typography variant='h4' marginBottom={1}>
                                        Chi ti???t d??? ??n
                                    </Typography>
                                    <Divider />
                                    <Grid container marginBottom={4} spacing={1}>
                                        <Grid xs={12} lg={6} xl={6} item>
                                            <TextField
                                                fullWidth
                                                select

                                                label={"Lo???i h??nh"}
                                                value={formData.information.type}
                                                onChange={e => setFormData(s => ({ ...s, information: { ...s.information, type: e.target.value } }))}
                                                defaultValue={""}
                                                margin="normal"
                                            >
                                                {projectType.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>
                                        <Grid xs={12} lg={6} xl={6} item>
                                            <TextField
                                                label="Gi?? mua b??n t???"
                                                type={"number"}
                                                fullWidth

                                                onChange={e => setFormData(s => ({ ...s, information: { ...s.information, purchaseInfo: Number(e.target.value) } }))}
                                                value={formData.information.purchaseInfo}
                                                margin="normal"
                                            />
                                        </Grid>
                                        <Grid xs={12} lg={6} xl={6} item>
                                            <TextField
                                                label="Gi?? cho thu?? t???"
                                                type={"number"}
                                                fullWidth
                                                onChange={e => setFormData(s => ({ ...s, information: { ...s.information, rentInfo: Number(e.target.value) } }))}
                                                value={formData.information?.rentInfo}
                                                margin="normal"
                                            />
                                        </Grid>
                                        <Grid xs={12} lg={6} xl={6} item>
                                            <TextField
                                                label="Kh???i c??ng d??? ??n t??? th??ng/n??m"
                                                fullWidth
                                                onChange={e => setFormData(s => ({ ...s, information: { ...s.information, startedAt: e.target.value } }))}
                                                value={formData.information?.startedAt}
                                                margin="normal"
                                            />
                                        </Grid>
                                        <Grid xs={12} lg={6} xl={6} item>
                                            <TextField
                                                label="N??m b??n giao"
                                                type={"number"}
                                                fullWidth
                                                onChange={e => setFormData(s => ({ ...s, information: { ...s.information, handOverYear: Number(e.target.value) } }))}
                                                value={formData.information?.handOverYear}
                                                margin="normal"
                                            />
                                        </Grid>
                                        <Grid xs={12} lg={6} xl={6} item>
                                            <TextField
                                                label="T???ng di???n t??ch"
                                                type={"number"}
                                                fullWidth
                                                onChange={e => setFormData(s => ({ ...s, information: { ...s.information, acreage: Number(e.target.value) } }))}
                                                value={formData.information?.acreage}
                                                margin="normal"
                                            />
                                        </Grid>
                                        <Grid xs={12} lg={6} xl={6} item>
                                            <TextField
                                                label="Quy m??"
                                                fullWidth
                                                onChange={e => setFormData(s => ({ ...s, information: { ...s.information, scale: Number(e.target.value) } }))}
                                                value={formData.information?.scale}
                                                margin="normal"
                                            />
                                        </Grid>
                                        <Grid xs={12} lg={6} xl={6} item>
                                            <TextField
                                                label="Ti???n ?????"
                                                fullWidth
                                                onChange={e => setFormData(s => ({ ...s, information: { ...s.information, progressStatus: Number(e.target.value) } }))}
                                                value={formData.information?.progressStatus}
                                                margin="normal"
                                            />
                                        </Grid>
                                        <Grid xs={12} lg={6} xl={6} item>
                                            <TextField
                                                label="Tr???ng th??i"
                                                fullWidth
                                                onChange={e => setFormData(s => ({ ...s, information: { ...s.information, status: Number(e.target.value) } }))}
                                                value={formData.information?.status}
                                                margin="normal"
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>
                        </Grid>
                    </SubCard>
                </Grid>
                <Grid item xs={12} lg={6}>
                    <SubCard title="Ti???n ??ch (4:3 / 16:9)">
                        <Typography>* H??nh ???nh hi???n t???i</Typography>
                        <Grid marginTop={2} container spacing={1}>
                            {project.utilities.map((item, index) => (
                                <Grid item lg={4} key={index}>
                                    <img src={item.image} style={{ width: '100%' }} />
                                    <Typography>{item.title}</Typography>
                                    <Box sx={{ display: "flex", justifyContent: "center", marginY: 1 }} fullWidth>
                                        <Button variant="outlined" onClick={() => onDeleteImage(index, 1)}>Lo???i b???</Button>
                                    </Box >
                                </Grid>
                            ))}
                        </Grid>
                        <Typography mt={2}>* H??nh ???nh th??m m???i</Typography>
                        <Grid item sm={12} xs={12}>
                            <ImageUploading
                                multiple
                                value={utilities}
                                onChange={imgList => onChange(imgList, 1)}
                                maxNumber={maxNumber}
                                dataURLKey="data_url"
                                resolutionType='ratio'
                            >
                                {({
                                    imageList,
                                    onImageUpload,
                                    onImageRemoveAll,
                                    onImageUpdate,
                                    onImageRemove,
                                    isDragging,
                                    dragProps,
                                }) => (
                                    // write your building UI
                                    <div className="upload__image-wrapper">

                                        <Grid marginTop={2} container spacing={1}>
                                            {imageList.map((elm, index) => (
                                                <Grid item xs={12} lg={6} key={index}>
                                                    <div className="image-item" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
                                                        <Box>
                                                            <img src={elm.image['data_url']} alt="" style={{ maxWidth: '100%', height: 'auto' }} />
                                                        </Box>
                                                        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 1 }} fullWidth>
                                                            <TextField
                                                                value={elm.title}
                                                                onChange={e => onTitleChange(e, index, 1)}
                                                                fullWidth
                                                                variant="outlined"
                                                                margin="normal"
                                                                label='Ti??u ????? ti???n ??ch'
                                                            />
                                                        </Box>
                                                        <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 1 }} fullWidth>
                                                            <Button variant="outlined" onClick={() => onOptionalRemove(index, 1)}>Lo???i b???</Button>
                                                        </Box >
                                                    </div>
                                                </Grid>
                                            ))}
                                        </Grid>
                                        <ButtonGroup sx={{ display: "flex", justifyContent: "center" }} fullWidth>
                                            <Button
                                                style={isDragging ? { color: 'red' } : undefined}
                                                onClick={onImageUpload}
                                                {...dragProps}
                                                variant="contained"
                                                color="secondary"
                                            >
                                                Th??m h??nh ???nh
                                            </Button>
                                            &nbsp;
                                            <Button
                                                variant="contained"
                                                color="error"
                                                onClick={onImageRemoveAll}
                                            >
                                                Xo?? to??n b??? ???nh v???a th??m
                                            </Button>
                                        </ButtonGroup>
                                    </div>
                                )}
                            </ImageUploading>
                        </Grid>
                    </SubCard>
                </Grid>

                <Grid item xs={12} lg={6}>
                    <SubCard title="M???t b???ng d??? ??n (4:3 / 16:9)">
                        <Typography>* H??nh ???nh hi???n t???i</Typography>
                        <Grid marginTop={2} container spacing={1}>
                            {project.masterPlan.map((item, index) => (
                                <Grid item lg={4} key={index}>
                                    <img src={item.image} style={{ width: '100%' }} />
                                    <Typography marginTop={2}>{item.title}</Typography>
                                    <Box sx={{ display: "flex", justifyContent: "center", marginY: 1 }} fullWidth>
                                        <Button variant="outlined" onClick={() => onDeleteImage(index, 2)}>Lo???i b???</Button>
                                    </Box >
                                </Grid>
                            ))}
                        </Grid>
                        <Typography mt={2}>* H??nh ???nh th??m m???i</Typography>
                        <Grid item sm={12} xs={12}>
                            <ImageUploading
                                multiple
                                value={masterPlan}
                                onChange={imgList => onChange(imgList, 2)}
                                maxNumber={maxNumber}
                                dataURLKey="data_url"
                            >
                                {({
                                    imageList,
                                    onImageUpload,
                                    onImageRemoveAll,
                                    onImageUpdate,
                                    onImageRemove,
                                    isDragging,
                                    dragProps,
                                }) => (
                                    // write your building UI
                                    <div className="upload__image-wrapper">

                                        <Grid marginTop={2} container spacing={1}>
                                            {imageList.map((elm, index) => (
                                                <Grid item xs={12} lg={6} key={index}>
                                                    <div className="image-item" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
                                                        <Box>
                                                            <img src={elm.image['data_url']} alt="" style={{ maxWidth: '100%', height: 'auto' }} />
                                                        </Box>
                                                        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 1 }} fullWidth>
                                                            <TextField
                                                                value={elm.title}
                                                                onChange={e => onTitleChange(e, index, 2)}
                                                                fullWidth
                                                                variant="outlined"
                                                                margin="normal"
                                                                label='Ti??u ????? m???t b???ng'
                                                            />
                                                        </Box>
                                                        <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 2 }} fullWidth>
                                                            <Button variant="outlined" onClick={() => onOptionalRemove(index, 2)}>Lo???i b???</Button>
                                                        </Box >
                                                    </div>
                                                </Grid>
                                            ))}
                                        </Grid>
                                        <ButtonGroup sx={{ display: "flex", justifyContent: "center" }} fullWidth>
                                            <Button
                                                style={isDragging ? { color: 'red' } : undefined}
                                                onClick={onImageUpload}
                                                {...dragProps}
                                                variant="contained"
                                                color="secondary"
                                            >
                                                Th??m h??nh ???nh
                                            </Button>
                                            &nbsp;
                                            <Button
                                                variant="contained"
                                                color="error"
                                                onClick={onImageRemoveAll}
                                            >
                                                Xo?? to??n b??? ???nh v???a th??m
                                            </Button>
                                        </ButtonGroup>
                                    </div>
                                )}
                            </ImageUploading>
                        </Grid>
                    </SubCard>
                </Grid>

                <Grid item xs={12} lg={12}>
                    <SubCard title="H??nh ???nh d??? ??n (16:9)">
                        <Typography>* H??nh ???nh hi???n t???i</Typography>
                        <Grid marginTop={2} container spacing={1}>
                            {project.media.images.map((image, index) => (
                                <Grid item lg={4} key={index}>
                                    <img src={image} style={{ width: '100%' }} />
                                    <Box sx={{ display: "flex", justifyContent: "center", marginY: 1 }} fullWidth>
                                        <Button variant="outlined" onClick={() => onDeleteImage(index, 0)}>Lo???i b???</Button>
                                    </Box >
                                </Grid>
                            ))}
                        </Grid>
                        <Typography>* H??nh ???nh th??m m???i</Typography>
                        <Grid item sm={12} xs={12}>
                            <ImageUploading
                                multiple
                                value={images}
                                onChange={imgList => onChange(imgList, 0)}
                                maxNumber={maxNumber}
                                dataURLKey="data_url"
                            >
                                {({
                                    imageList,
                                    onImageUpload,
                                    onImageRemoveAll,
                                    onImageUpdate,
                                    onImageRemove,
                                    isDragging,
                                    dragProps,
                                }) => (
                                    // write your building UI
                                    <div className="upload__image-wrapper">

                                        <Grid marginTop={2} container spacing={1}>
                                            {imageList.map((image, index) => (
                                                <Grid item xs={12} lg={3} key={index}>
                                                    <div className="image-item" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
                                                        <Box>
                                                            <img src={image['data_url']} alt="" style={{ maxWidth: '100%', height: 'auto' }} />
                                                        </Box>
                                                        <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 1 }} fullWidth>
                                                            <Button variant="outlined" onClick={() => onImageUpdate(index)}>S???a ?????i</Button>
                                                            <Button variant="outlined" onClick={() => onImageRemove(index)}>Lo???i b???</Button>
                                                        </Box >
                                                    </div>
                                                </Grid>
                                            ))}
                                        </Grid>

                                        <ButtonGroup sx={{ display: "flex", justifyContent: "center" }} fullWidth>
                                            <Button
                                                style={isDragging ? { color: 'red' } : undefined}
                                                onClick={onImageUpload}
                                                {...dragProps}
                                                variant="contained"
                                                color="secondary"
                                            >
                                                Th??m h??nh ???nh
                                            </Button>
                                            &nbsp;
                                            <Button
                                                variant="contained"
                                                color="error"
                                                onClick={onImageRemoveAll}
                                            >
                                                Xo?? to??n b??? ???nh v???a th??m
                                            </Button>
                                        </ButtonGroup>
                                    </div>
                                )}
                            </ImageUploading>
                        </Grid>
                    </SubCard>
                </Grid>

                <Grid item xs={12} lg={12}>
                    <SubCard>
                        <Grid justifyContent="flex-end" container>
                            <Box sx={{ m: "0px 4px", position: 'relative' }}>
                                <Button variant="contained" type="submit" disabled={isUploading}>C???p nh???t d??? ??n</Button>
                                {isUploading && (
                                    <CircularProgress
                                        size={24}
                                        sx={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            marginTop: '-12px',
                                            marginLeft: '-12px',
                                        }}
                                    />
                                )}
                            </Box>
                        </Grid>
                    </SubCard>
                </Grid>
            </Grid >
            <Modal
                open={modal.active}
                onClose={() => onCloseModal()}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    border: '1px solid #eee',
                    boxShadow: 0,
                    p: 4,
                }}>
                    <Typography id="modal-modal-title" variant="h4" component="h2" marginBottom={1}>
                        Th??ng b??o
                    </Typography>
                    <Divider />
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        {modal.message}
                    </Typography>
                </Box>
            </Modal>
        </form >
    );
}

export default UpdateProject;