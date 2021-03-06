import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from '../styles/pages/index.module.scss'
import { FaHome, FaClock, FaChevronRight, FaLocationArrow, FaPhoneAlt, FaFax, FaEnvelope, FaBars, FaArrowRight, FaArrowDown, FaGlobe } from 'react-icons/fa';
import { CgArrowLongDown } from 'react-icons/cg'
import { useRouter } from "next/router";
import { Col, Row, SpecialContainer } from "../UI/gridSystem";
//@ts-ignore
import { Zoom, Fade } from 'react-reveal';
import { BlogInterface } from "../types/interfaces/blog";
import { initializeApollo } from "../lib/apolloClient";
import { GET_BLOGS, GET_PAGE_TEMPLATE } from "../graphql/queries/introPage";
import Link from "next/link";
import { GET_TOP_PROJECTS_QUERY } from "../graphql/queries/homePage";
import { ProjectInterface } from "../types/interfaces/project";
import { useEffect, useState } from "react";
import Moment from "react-moment";

interface AboutPageProps {
    template: {
        banner: string | null
    }
    blogs: BlogInterface[]
    projects: ProjectInterface[]
}

const AboutPage: NextPage<AboutPageProps> = ({ template, blogs, projects }) => {
    const [selectedProject, setSelectedProject] = useState<ProjectInterface | undefined>()
    const [isNavActive, setNavActive] = useState<boolean>(false)

    const router = useRouter()

    useEffect(() => {
        if (projects.length !== 0) {
            setSelectedProject(projects[0])
        }
    }, [projects])

    const renderProjects = (): JSX.Element[] => {
        return projects.map((project, index) => {
            return (
                <Col xl={6} key={index}>
                    <div className={`${styles['project-name']} ${project._id === selectedProject?._id ? styles['project-name--active'] : ''}`} onClick={() => setSelectedProject(project)}>
                        <FaArrowRight />
                        {project.projectName}
                    </div>
                </Col>
            )
        })
    }

    const renderBlogs = (): JSX.Element[] => {
        return blogs.map((blog, index) => {
            return (
                <Col md={6} lg={4} xl={3} key={index}>
                    <Zoom >
                        <div className={`${styles['list-item']}`}>
                            <div>
                                <Image
                                    src={blog.image}
                                    width={592}
                                    height={420}
                                    alt="#"
                                />
                            </div>
                            <div className={styles['news-descr']}>
                                <div className={styles['popup__title']}>{blog.title}</div>
                                <div className={styles['popup__timestamp']}><FaClock style={{ marginRight: 4 }} />
                                    <Moment format="DD/MM/yyyy">
                                        {blog.timeStamp}
                                    </Moment>
                                </div>
                                <div className={styles['popup__detail']}>{blog.content.slice(0, blog.content.length >= 150 ? 150 : blog.content.length - 2)} ........</div>
                                <div className={styles['popup__btn']}>
                                    <button onClick={() => router.push(`/blog/${blog.link}`)}> Xem th??m </button>
                                </div>
                            </div>
                        </div>
                    </Zoom>
                </Col>
            )
        })
    }

    return (
        <>
            <Head>
                <title> ??I???N KH??I LAND </title>
                <link rel="icon" href="https://res.cloudinary.com/dienkhoiland/image/upload/v1656394563/logo/LOGO-DIEN-KHOI_amhn6i.ico" />
                <meta name="description" content="H??? sinh th??i d???ch v??? b???t ?????ng s???n s??? 1 - ??i???n Kh??i Land ??ang ng??y c??ng ho??n thi???n d???ch v??? m??i gi???i, truy???n th??ng, ?????u t?? v?? qu???n l?? b???t ?????ng s???n" />
            </Head>
            {/* Header  */}
            <header className={styles["header"]}>
                <SpecialContainer>
                    <div className={styles['header-area']}>
                        <div className={styles["logo"]} onClick={() => router.push("/")}>
                            <Image
                                src={"https://res.cloudinary.com/dienkhoiland/image/upload/v1656328913/logo/logo_nfdfc7.png"}
                                alt="#"
                                width={275}
                                height={50}
                            />
                        </div>
                        <nav className={`${styles['menu']} ${isNavActive ? styles['menu--active'] : ''}`}>
                            <ul>
                                <li> {isNavActive ? <Link href={'/home'}> B???t ?????ng s???n </Link> : <button onClick={() => router.push("/home")}> <FaHome /></button>} </li>
                                <li> <Link href={"/"}>Gi???i thi???u</Link> </li>
                                <li>  <Link href={"/#tin-tuc"}>Tin t???c</Link> </li>
                                <li> <Link href={"/#linh-vuc-hoat-dong"}>L??nh v???c ho???t ?????ng</Link> </li>
                                <li> <Link href={"/#du-an-noi-bat"}>D??? ??n</Link> </li>
                                <li> <Link href={"/#lien-he"}>Li??n h???</Link> </li>
                            </ul>
                            <button onClick={() => setNavActive(s => !s)}> <FaBars /> </button>
                        </nav>
                    </div>
                </SpecialContainer>
            </header>
            {/* Banner  */}
            <section>
                {template.banner
                    && (
                        <div className={styles['banner']} style={{ backgroundImage: `url(${template.banner})` }}>
                            <div className={styles['scroll-down']}>
                                <div className={styles['scroll-down__item']} onClick={() => router.push('/#tin-tuc')}>
                                    <span>Kh??m ph??</span>
                                    <div className={styles['arrow']}>
                                        <CgArrowLongDown />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </section>

            {/* News */}
            <section className={styles["news"]} id="tin-tuc">
                <SpecialContainer>
                    <Row>
                        <Col xl={12}>
                            <div className={styles['news-title']}>
                                Tin t???c v?? s??? ki???n
                                <div className={`${styles['divider']}`}></div>
                            </div>
                        </Col>
                    </Row>
                    <div className={styles['news-list']}>
                        <Row>
                            {renderBlogs()}
                        </Row>
                    </div>
                </SpecialContainer>
            </section>
            {/* Category  */}
            <section className={styles['categories']} id="linh-vuc-hoat-dong">
                <div className={styles['categories-title']}>L??NH V???C HO???T ?????NG</div>
                <Fade left>
                    <div className={styles['categories-list']}>
                        <div className={styles['categories-list__item']}>
                            <div className={styles['category']}>
                                <Image
                                    width={500}
                                    height={853}
                                    src={"/img/xay-dung.jpg"}
                                    alt="#"
                                />
                                <div className={styles["category-desc"]}>
                                    <div className={styles["category-desc__title"]}>Ph??t tri???n<br />b???t ?????ng s???n</div>
                                    <div className={styles["category-desc__content"]}>??I???N KH??I LAND cung c???p nh???ng d??? ??n ch???t l?????ng cao v?? gi??u ti???m n??ng. Tr???i nghi???m c???a kh??ch h??ng lu??n l?? ??u ti??n h??ng ?????u c???a ch??ng t??i.</div>
                                </div>
                            </div>
                        </div>
                        <div className={styles['categories-list__item']}>
                            <div className={styles['category']}>
                                <Image
                                    width={500}
                                    height={853}
                                    src={"/img/phat-trien-bds.jpg"}
                                    alt="#"
                                />
                                <div className={styles["category-desc"]}>
                                    <div className={styles["category-desc__title"]}>D???CH V???</div>
                                    <div className={styles["category-desc__content"]}>Tr???i nghi???m c???a kh??ch h??ng lu??n ???????c ch?? tr???ng, ch??ng t??i lu??n ??u ti??n s??? nhanh ch??ng v?? ????p ???ng ???????c t???i ??a nhu c???u c???a kh??ch h??ng. ??I???N KH??I LAND - kh??ng ch??? cung c???p s???n ph???m b???t ?????ng s???n.</div>
                                </div>
                            </div>
                        </div>
                        <div className={styles['categories-list__item']}>
                            <div className={styles['category']}>
                                <Image
                                    width={500}
                                    height={853}
                                    src={"/img/khu-cong-nghiep-home2.jpg"}
                                    alt="#"
                                />
                                <div className={styles["category-desc"]}>
                                    <div className={styles["category-desc__title"]}>?????U T?? V?? PH??T TRI???N</div>
                                    <div className={styles["category-desc__content"]}>????p ???ng nhu c???u v??? c??c lo???i h??nh b???t ?????ng s???n, c??ng nh?? ti???m n??ng v??? th??? tr?????ng t???i T???nh ?????k L???k, ??I???N KH??I LAND - ti??n phong k???t n???i, d???n l???i th??nh c??ng. </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles['categories-list__item']}>
                            <div className={styles['category']}>
                                <Image
                                    width={500}
                                    height={853}
                                    src={"/img/HSS_6331_resize.jpg"}
                                    alt="#"
                                />
                                <div className={styles["category-desc"]}>
                                    <div className={styles["category-desc__title"]}>NH??N L???C</div>
                                    <div className={styles["category-desc__content"]}>V???i nh??n s??? ph??? r???ng ??? nhi???u ????? tu???i, ??I???N KH??I LAND s??? h???u ngu???n t??i nguy??n v??? con ng?????i ??ang d???ng v?? h??i h??a t??? kinh nghi???m ?????n s???c tr???. ??I???N KH??I LAND - kh??ng g?? l?? kh??ng th???.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Fade>
            </section>

            {/* Project */}
            <section className={styles['project']} id="du-an-noi-bat">
                <div className={styles['project-list']}>
                    <div className={styles['project-list__item']}>
                        <Fade left>
                            <div className={styles['project-info']}>
                                <div className={styles['project-title']}>D??? ??N N???I B???T
                                    <div className={styles['divider']}></div>
                                </div>
                                <Row>
                                    {renderProjects()}
                                </Row>
                            </div>
                        </Fade>
                    </div>
                    <div className={styles['project-list__item']}>
                        <div className={styles['project-item']}>
                            {selectedProject?.media.images[0]
                                && (
                                    <Image
                                        width={1200}
                                        height={900}
                                        src={selectedProject?.media.images[0]}
                                        alt="#"
                                    />
                                )
                            }
                            {selectedProject?.media.images[0]
                                && (
                                    <div className={styles['project-item__name']} onClick={() => router.push(`/du-an/${selectedProject.directLink}`)}>
                                        <FaChevronRight />
                                        <p>{selectedProject?.projectName}</p>
                                    </div>
                                )
                            }
                        </div>
                    </div>

                </div>
            </section>

            {/* footer */}
            <footer className={styles['footer']} id="lien-he">
                <div className={styles['footer-bg']}>
                    <SpecialContainer>
                        <div className={styles["footer-list"]}>
                            <div className={styles["ftr-list-col--big"]}>
                                <Image
                                    src={"/logo/logo.png"}
                                    alt="#"
                                    width={275}
                                    height={50}
                                />
                                <div className={styles['company-info']}>
                                    <p>
                                        <FaLocationArrow />
                                        Tr??? s??? ch??nh: 89G L?? Th??i T???, P. T??n L???i, Tp. Bu??n Ma Thu???t, T???nh ?????k L???k
                                    </p>
                                    <p>
                                        <FaPhoneAlt />
                                        ??i???n tho???i: 0262 223 8888
                                    </p>
                                    <p>
                                        <FaEnvelope />
                                        Email: info@dienkhoigroup.vn
                                    </p>
                                    <div className={styles['company-info__item']}>
                                        <FaGlobe />
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <div style={{ marginRight: 12 }}>Website:</div>
                                            <div><div>dienkhoiland.vn</div><div>dienkhoigroup.vn</div></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={styles['ftr-list-col']}>
                                <div className={styles['company-info']}>
                                    <h5>V??N PH??NG GIAO D???CH</h5>
                                    <p>V??n ph??ng t???i ?????k L???k :
                                        <br />-89G L?? Th??i T???, P. T??n L???i, TP. Bu??n Ma Thu???t, T???nh ?????k L???k.
                                        {/* <br /><br />V??n ph??ng t???i TP. H??? Ch?? Minh:
                                        <br />-T???ng 8-9, T??a nh?? Cen Group, 91A Cao Th???ng, ph?????ng 3, qu???n 3, TP.HCM. */}
                                    </p>
                                </div>
                            </div>
                            <div className={styles['ftr-list-col']}>
                                <div className={styles['company-info']}>
                                    <h5>C??NG TY C??? PH???N T???P ??O??N ??I???N KH??I </h5>
                                    <p>??KKD 6001713501 Do s??? K??? Ho???ch v?? ?????u T?? T???nh ?????k L???k c???p ng??y 18 th??ng 4 n??m 2022</p>
                                </div>
                            </div>
                        </div>
                    </SpecialContainer>
                </div>
            </footer>
        </>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    try {
        const client = initializeApollo()

        const blogResult = await client.query({
            query: GET_BLOGS
        })

        const templateResult = await client.query({
            query: GET_PAGE_TEMPLATE,
            variables: {
                pageName: "introduction"
            }
        })

        const projectsResult = await client.query<{ projects: ProjectInterface[] }>({
            query: GET_TOP_PROJECTS_QUERY
        })

        return {
            props: {
                template: templateResult?.data.template || { banner: null },
                blogs: blogResult?.data.blogs || [],
                projects: projectsResult?.data.projects || []
            },
            revalidate: 60
        }

    } catch (error) {
        return {
            props: {
                template: { banner: null },
                blogs: [],
                projects: []
            },
            revalidate: 60
        }
    }
}

export default AboutPage