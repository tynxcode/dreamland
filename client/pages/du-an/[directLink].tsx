import Head from "next/head"
import Image from "next/image"
import { FaMapMarkedAlt } from "react-icons/fa"
import { Carousel } from "react-responsive-carousel"
import Header from "../../components/header/header"
import styles from '../../styles/pages/du-an.module.scss'
import Footer from "../../components/footer/footer"
import { GetServerSideProps, NextPage } from "next"
import { ProjectInterface } from "../../types/interfaces/project"
import { initializeApollo } from "../../lib/apolloClient"
import { getProjectByDirectLinkVars, GET_PROJECT_BY_DIRECT_LINK } from "../../graphql/queries/projectPage"
import { ProjectTypeTranslate } from "../../types/enums/project"
import { useState } from "react"
import { useRouter } from "next/router"
import { Md360 } from 'react-icons/md'
import { moneyConverter } from "../../lib/converter"
import ProjectProducts from "../../components/table/product-table"
// import Maps from "../../components/maps/maps"

interface RealEstateProjectPageProps {
    project: ProjectInterface | null
}


const RealEstateProject: NextPage<RealEstateProjectPageProps> = ({ project }) => {
    const [currentMasterPlanId, setMasterPlanId] = useState<number>(0)
    // const [showMaps, setShowMaps] = useState<boolean>(false)

    const router = useRouter()

    if (!project) return null

    const renderImage = (): JSX.Element[] => {
        return project.media.images.map((el, id) => {
            return (
                <div className={styles["image"]} key={id}>
                    <Image src={el} width={1920} height={1080} />
                </div>
            )
        })
    }

    const renderProjectPlan = (): JSX.Element[] => {
        return project.masterPlan.map((el, id) => {
            return (
                <h5
                    style={{ backgroundColor: id === currentMasterPlanId ? "#f4f4f4" : "#fff" }}
                    onClick={e => setMasterPlanId(id)}
                    key={id}
                >
                    {el.title}
                </h5>
            )
        })
    }

    const renderProjectUtilities = (): JSX.Element[] => {
        return project.utilities.map((el, id) => {
            return (
                <div className={styles['pj-utilities__col']} key={id}>
                    <div className={styles['pj-utilities-item']}>
                        <Image
                            className={styles['utilities-image']}
                            src={el.image}
                            alt={el.title}
                            width={1920}
                            height={1080}
                        />
                        <div className={styles['utilities-title']}>{el.title}</div>
                    </div>
                </div>
            )
        })
    }

    return (
        <>
            <Head>
                <title>{project.projectName}</title>
                <link rel="icon" href="https://res.cloudinary.com/dienkhoiland/image/upload/v1656394563/logo/LOGO-DIEN-KHOI_amhn6i.ico" />
            </Head>
            <Header />
            <main>
                <div className={styles['project']}>
                    <div className={styles['images']}>

                        <Carousel showThumbs={false} showIndicators={false}>
                            {renderImage()}
                        </Carousel>

                    </div>
                    <div className="container">
                        <div className={styles['project-header']}>
                            <h3>{project.projectName}</h3>
                            <div className={styles['project-header__address']}>
                                <FaMapMarkedAlt />
                                <p>
                                    {project.address.showHouseNumber ? project.address?.houseNumber : ""}
                                    {project.address.street},
                                    {project.address.ward},
                                    {project.address.district},
                                    {project.address.province}
                                    {/* <span onClick={() => setShowMaps(true)}>Xem b???n ?????</span> */}
                                </p>
                            </div>
                            <div className={styles['project-header__links']}>
                                {project.virtual3DLink && <button onClick={() => window.open(project.virtual3DLink)}> <Md360 /> Xem 3D</button>}
                            </div>
                        </div>
                        <div className={styles['project-content']}>
                            <nav className={styles['content-navigator']}>
                                <a className={styles['content-navigator__item'] + ` ${styles['content-navigator__item--active']}`} href="#thongtin">Th??ng tin</a>
                                <a className={styles['content-navigator__item']} href="#tienich">Ti???n ??ch</a>
                                {/* <a className={styles['content-navigator__item']} href="#tindangban">Tin ????ng b??n</a>
                            <a className={styles['content-navigator__item']} href="#tinchothue">Tin cho thu??</a> */}
                                <a className={styles['content-navigator__item']} href="#chudautu">Ch??? ?????u t??</a>
                                <a className={styles['content-navigator__item']} href="#gioithieu">Gi???i thi???u</a>
                                <a className={styles['content-navigator__item']} href="#matbang">M???t b???ng</a>
                            </nav>
                            <div className={styles['pj-desr']} id="gioithieu">
                                <div className={styles["content-title"]}>
                                    <h3>Gi???i thi???u d??? ??n</h3>
                                    <h4>{project.projectName} {project.address.province}</h4>
                                    <div className={styles["hr"]}>
                                        <img src="https://batdongsanexpress.vn/template/detail/images/line.gif" alt="#" />
                                    </div>
                                </div>
                                <div className={styles['pj-desr__content']}>
                                    {project.description}
                                </div>
                            </div>
                            <div className={styles['pj-info']} id="thongtin">
                                <div className={styles["content-title"]}>
                                    <h3> Th??ng tin d??? ??n </h3>
                                    <h4>{project.projectName}  {project.address.province}</h4>
                                    <div className={styles["hr"]}>
                                        <img src="https://batdongsanexpress.vn/template/detail/images/line.gif" alt="#" />
                                    </div>
                                </div>
                                <div className={styles['pj-info__row']}>
                                    <div className={styles['pj-info__col']}>
                                        <img src={project.media.images[0]} alt="" />
                                    </div>
                                    <div className={styles['pj-info__col']}>
                                        <div className={`${styles['pj-info-item']} `}>
                                            <h5>Gi?? mua b??n</h5>
                                            <p>{project.information?.purchaseInfo ? `T??? ${moneyConverter(project.information.purchaseInfo)}` : "---"}</p>
                                        </div>
                                        <div className={styles['pj-info-item']}>
                                            <h5>Kh???i c??ng</h5>
                                            <p>{project.information?.startedAt ?? "---"}</p>
                                        </div>
                                        <div className={styles['pj-info-item']}>
                                            <h5>Ch??? ?????u t??</h5>
                                            <p>{project.investor.name}</p>
                                        </div>
                                        <div className={styles['pj-info-item']}>
                                            <h5>T???ng di???n t??ch</h5>
                                            <p>{project.information?.acreage ?? "---"}</p>
                                        </div>
                                        <div className={styles['pj-info-item']}>
                                            <h5>Ti???n ?????</h5>
                                            <p>{project.information?.progressStatus ?? "---"}</p>
                                        </div>
                                        <div className={`${styles['pj-info-item']} `}>
                                            <h5>Gi?? cho thu??</h5>
                                            <p>{project.information?.rentInfo ? `T??? ${moneyConverter(project.information.rentInfo)}` : "---"}</p>
                                        </div>
                                        <div className={styles['pj-info-item']}>
                                            <h5>N??m b??n giao</h5>
                                            <p>{project.information?.handOverYear ?? "---"}</p>
                                        </div>
                                        <div className={styles['pj-info-item']}>
                                            <h5>Lo???i h??nh</h5>
                                            <p>{ProjectTypeTranslate(project.information.type)}</p>
                                        </div>
                                        <div className={styles['pj-info-item']}>
                                            <h5>Quy m??</h5>
                                            <p>{project.information?.scale ?? "---"}</p>
                                        </div>
                                        <div className={styles['pj-info-item']}>
                                            <h5>Tr???ng th??i</h5>
                                            <p>{project.information?.status ?? "---"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={styles['pj-utilities']} id="tienich">
                                <div className={styles["content-title"]}>
                                    <h3> Ti???n ??ch n???i b???t </h3>
                                    <h4>{project.projectName}  {project.address.province}</h4>
                                    <div className={styles["hr"]}>
                                        <img src="https://batdongsanexpress.vn/template/detail/images/line.gif" alt="#" />
                                    </div>
                                </div>
                                <div className={styles['pj-utilities__row']}>
                                    {renderProjectUtilities()}
                                </div>
                            </div>
                            <div className={styles['pj-plan']} id="matbang">
                                <div className={styles["content-title"]}>
                                    <h3>M???t b???ng d??? ??n</h3>
                                    <h4>{project.projectName} {project.address.province}</h4>
                                    <div className={styles["hr"]}>
                                        <img src="https://batdongsanexpress.vn/template/detail/images/line.gif" alt="#" />
                                    </div>
                                </div>
                                {project.masterPlan.length !== 0
                                    && (
                                        <div className={styles['pj-plan-track']}>
                                            <div className={styles['pj-plan-track__selector']}>
                                                {renderProjectPlan()}
                                            </div>
                                            <div className={styles['pj-plan-track__img']}>
                                                <Image
                                                    src={project.masterPlan[currentMasterPlanId].image}
                                                    width={800}
                                                    height={600}
                                                    alt=""
                                                />
                                            </div>
                                        </div>
                                    )
                                }
                            </div>

                            <div className={styles['pj-owner']} id="chudautu">

                                <div className={styles["content-title"]}>
                                    <h3>Ch??? ?????u t?? d??? ??n</h3>
                                    <h4>{project.projectName}  {project.address.province}</h4>
                                    <div className={styles["hr"]}>
                                        <img src="https://batdongsanexpress.vn/template/detail/images/line.gif" alt="#" />
                                    </div>
                                </div>
                                <div className={styles['owner']}>
                                    <div className={styles['owner__name']}>
                                        <p>{project.investor.name}</p>
                                        <h6>{project.investor.about}</h6>
                                    </div>
                                </div>
                                {/* <div className={styles['owner-decr']}>
                                {project?.investor.about}
                            </div> */}
                            </div>

                            <div>
                                <div className={styles["content-title"]}>
                                    <h3>S???n ph???m d??? ??n</h3>
                                    <h4>{project.projectName}  {project.address.province}</h4>
                                    <div className={styles["hr"]}>
                                        <img src="https://batdongsanexpress.vn/template/detail/images/line.gif" alt="#" />
                                    </div>
                                </div>
                                <ProjectProducts project={project._id}/>
                            </div>

                            {/* <div className={styles['pj-items']} id="tindangban">
                            <h3>Tin ????ng b??n d??? ??n Vinhomes Grand Park (Vincity Qu???n 9)</h3>
                            <Items data={[...relativePosts.sellingApartments, ...relativePosts.sellingHouses, ...relativePosts.sellingLands]} />
                            <div className={styles['pj-items__more']}>
                                <Link href={"/"}> Xem th??m tin cho thu?? </Link>
                            </div>
                        </div>
                        <div className={styles['pj-items']} id="tinchothue">
                            <h3>Tin cho thu?? d??? ??n Vinhomes Grand Park (Vincity Qu???n 9)</h3>
                            <Items data={[...relativePosts.rentingApartments, ...relativePosts.rentingHouses, ...relativePosts.rentingLands]} />
                            <div className={styles['pj-items__more']}>
                                <Link href={"/"}> Xem th??m tin cho thu?? </Link>
                            </div>
                        </div> */}
                        </div>
                    </div>
                </div>
            </main>
            {/* <Maps show={showMaps} handleShow={setShowMaps} address={project.address} /> */}
            <Footer />
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    try {
        const { directLink } = context.query
        if (!directLink) {
            return {
                redirect: {
                    destination: "/du-an-bat-dong-san",
                    permanent: false
                }
            }
        }
        const client = initializeApollo()
        const { data } = await client.query<{ getProjectByDirectLink: ProjectInterface }, getProjectByDirectLinkVars>({
            query: GET_PROJECT_BY_DIRECT_LINK,
            variables: {
                link: String(directLink)
            }
        })

        return {
            props: {
                project: data?.getProjectByDirectLink || null
            }
        }
    } catch (error) {
        return {
            props: {
                project: null
            }
        }
    }
}

export default RealEstateProject