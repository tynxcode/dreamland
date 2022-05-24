import Head from "next/head";
import { FunctionComponent, useState } from "react";
import { FaAngleDoubleRight, FaCity, FaMapMarkedAlt } from "react-icons/fa";
import { BiPhone } from "react-icons/bi"
import Header from "../../../components/header/header";
import styles from '../../../styles/pages/item.module.scss'
import { Carousel } from 'react-responsive-carousel';
import Image from "next/image";
import Footer from "../../../components/footer/footer";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { initializeApollo } from "../../../lib/apolloClient";
import { ApartmentInterface } from "../../../types/interfaces/apartment";
import { GET_BUSINESS_PREMISES_POST_BY_DIRECT_LINK } from "../../../graphql/queries/postPage";
import { RealEstateCategory } from "../../../types/enums/realEstate";
import { directionSpeaker, furnitureSpeaker, legalDocumentsSpeaker, moneyConverter, premisesTypeSpeaker, userTypeSpeaker } from "../../../lib/converter";
import { useRouter } from "next/router";
import Maps from "../../../components/maps/maps";
import { BusinessPremisesInterface } from "../../../types/interfaces/businessPremises";

interface BusinessPremisesPageProps {
    data: BusinessPremisesInterface | null
}

const BusinessPremisesPage: FunctionComponent<BusinessPremisesPageProps> = ({ data }) => {
    const [showPhoneNumber, setShowPhoneNumber] = useState<boolean>(false)
    const [showMaps, setShowMaps] = useState<boolean>(false)

    const router = useRouter()

    if (!data) return null

    const renderMedia = () => {
        return data.media.images.map((el, id) => {
            return (
                <div className={styles["image"]} key={id}>
                    <img src={el} />
                    <span>
                        <Image
                            src={el}
                            width={800}
                            height={600}
                            alt="Image"
                        />
                    </span>
                    <div className={styles['image__abs']}>
                        <img src={el} />
                    </div>
                </div>
            )
        })
    }

    return (
        <>
            <Head>
                <title> {data.title} </title>
            </Head>
            <Header />
            <main style={{ backgroundColor: "#f4f4f4", padding: '64px 0' }}>
                <div className="container">
                    <div className={styles['link']}>
                        <ol>
                            <li><span>Trang chủ</span> <FaAngleDoubleRight /></li>
                            <li><span>{data.category === RealEstateCategory.MuaBan ? "Mua Bán" : "Cho Thuê"}</span> <FaAngleDoubleRight /></li>
                            <li><span>{data.detail.address.province}</span> <FaAngleDoubleRight /></li>
                            <li><span>{data.title}</span></li>
                        </ol>
                        <button> Về danh sách </button>
                    </div>
                    <div className={styles['area']}>
                        <div className={styles['content']}>
                            <Carousel>
                                {renderMedia()}
                            </Carousel>
                            <div className={styles['name']}>
                                {data.title}
                            </div>
                            <div className={styles['price']}>
                                <span>{moneyConverter(data.detail.pricing.total)}</span>
                                <span> - {data.detail.acreage.totalAcreage} m2</span>
                            </div>
                            {/* <div className={styles['installment']}>
                                <FaUniversity />
                                <p>Trả góp <span>50.6 triệu/tháng</span>, trả trước 1.08 tỷ</p>
                            </div> */}
                            <div className={styles['address']}>
                                <FaMapMarkedAlt />
                                <p>{data.detail.address.showHouseNumber && data.detail.address.houseNumber}
                                    , {data.detail.address.street}
                                    , {data.detail.address.ward}
                                    , {data.detail.address.district}
                                    , {data.detail.address.province}
                                </p>
                                <span onClick={() => setShowMaps(true)}>Xem bản đồ</span>
                            </div>
                            {data.detail.project
                                &&
                                (
                                    <div className={styles['project']}>
                                        <FaCity />
                                        <p onClick={() => router.push(`/du-an/${data.detail.project?.directLink}`)}>
                                            Dự án:
                                            <span>{data.detail.project.projectName}</span>
                                        </p>
                                    </div>
                                )
                            }
                            <div className={styles['description']}>
                                {data.description}
                            </div>
                        </div>
                        <div className={styles['contact']}>
                            <div className={styles['contact-owner']}>
                                <Image src={'/logo/profile.png'} width={50} height={50} />
                                <div className={styles['contact-owner__info']}>
                                    <h5>{data.owner.user.name}</h5>
                                    <span>{userTypeSpeaker(data.owner.type)}</span>
                                </div>
                            </div>
                            <div className={styles['contact-phone']}>
                                <div className={styles['contact-phone__guard']} onClick={() => setShowPhoneNumber(s => !s)}>
                                    <div className={`${styles['phone--hidden']}`}>
                                        <BiPhone />
                                        <span>
                                            {showPhoneNumber
                                                ? (data.owner.user.phone)
                                                : (`${data.owner.user.phone.slice(0, 4)}******`)
                                            }
                                        </span>
                                    </div>
                                    <div>Bấm để hiện số</div>
                                </div>
                            </div>
                            <div className={styles['overview']}>
                                <h4> Thông tin cơ bản </h4>
                                <div className={styles['overview__col']}>
                                    <div className={styles['overview-item']}>
                                        <div className={styles['overview-item__image']}>
                                            <Image src={"/desc/dien-tich.png"} width={25} height={25} alt="dien-tich" />
                                        </div>
                                        <span>Diện tích: </span>
                                        <span>{data.detail.acreage.totalAcreage} m²</span>
                                    </div>
                                    {data.overview.legalDocuments
                                        && (
                                            <div className={styles['overview-item']}>
                                                <div className={styles['overview-item__image']}>
                                                    <Image src={"/desc/contract.png"} width={25} height={25} alt="dien-tich" />
                                                </div>
                                                <span>Giấy tờ pháp lý: </span>
                                                <span>{legalDocumentsSpeaker(data.overview.legalDocuments)}</span>
                                            </div>
                                        )
                                    }
                                    {data.overview.furniture
                                        && (
                                            <div className={styles['overview-item']}>
                                                <div className={styles['overview-item__image']}>
                                                    <Image src={"/desc/sofa.png"} width={25} height={25} alt="dien-tich" />
                                                </div>
                                                <span>Tình trạng nội thất: </span>
                                                <span>{furnitureSpeaker(data.overview.furniture)}</span>
                                            </div>
                                        )
                                    }
                                </div>
                                <div className={styles['overview__col']}>
                                    {/* <div className={styles['overview-item']}>
                                        <div className={styles['overview-item__image']}>
                                            <Image src={"/desc/double-arrow-horizontal-symbol.png"} width={25} height={25} alt="dien-tich" />
                                        </div>
                                        <span>Chiều dọc: </span>
                                        <span>48 m²</span>
                                    </div>
                                    <div className={styles['overview-item']}>
                                        <div className={styles['overview-item__image']}>
                                            <Image src={"/desc/double-arrow-vertical-symbol.png"} width={25} height={25} alt="dien-tich" />
                                        </div>
                                        <span>Chiều ngang: </span>
                                        <span>4 phòng</span>
                                    </div> */}
                                    {data.category === RealEstateCategory.MuaBan
                                        && (
                                            <div className={styles['overview-item']}>
                                                <div className={styles['overview-item__image']}>
                                                    <Image src={"/desc/money.png"} width={25} height={25} alt="dien-tich" />
                                                </div>
                                                <span>Giá/m2: </span>
                                                <span>{moneyConverter(Math.round(data.detail.pricing.total / data.detail.acreage.totalAcreage))}/m²</span>
                                            </div>
                                        )
                                    }
                                    {data.overview.doorDirection
                                        && (
                                            <div className={styles['overview-item']}>
                                                <div className={styles['overview-item__image']}>
                                                    <Image src={"/desc/north.png"} width={25} height={25} alt="dien-tich" />
                                                </div>
                                                <span>Hướng cửa chính: </span>
                                                <span>{directionSpeaker(data.overview.doorDirection)}</span>
                                            </div>
                                        )
                                    }
                                    {data.overview.type
                                        && (
                                            <div className={styles['overview-item']}>
                                                <div className={styles['overview-item__image']}>
                                                    <Image src={"/desc/smart-home.png"} width={25} height={25} alt="dien-tich" />
                                                </div>
                                                <span>Loại hình mặt bằng: </span>
                                                <span>{premisesTypeSpeaker(data.overview.type)}</span>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles['stall']}>
                        <h4> Tin bất động sản liên quan </h4>
                        <div className={styles['stall__items']}>
                            {/* <Items /> */}
                        </div>
                        <div className={styles['stall__more']}>
                            <Link href={"/"}> Xem thêm tin liên quan </Link>
                        </div>
                    </div>
                </div>
            </main>
            <Maps show={showMaps} handleShow={setShowMaps} address={data.detail.address} />
            <Footer />
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    try {
        const { directLink } = context.query
        if (!directLink) {
            return {
                redirect: {
                    destination: "/mua-ban-bat-dong-san",
                    permanent: false
                }
            }
        }

        const client = initializeApollo()
        const { data } = await client.query<{ businessPremises: ApartmentInterface }>({
            query: GET_BUSINESS_PREMISES_POST_BY_DIRECT_LINK,
            variables: {
                link: String(directLink)
            }
        })

        return {
            props: {
                data: data?.businessPremises ?? null
            }
        }
    } catch (error) {
        return {
            props: {
                data: null
            }
        }
    }
}

export default BusinessPremisesPage;