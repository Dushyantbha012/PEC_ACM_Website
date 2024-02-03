import DashboardLayout from "../../components/layout/DashboardLayout";
import styles from "../../styles/pages/DashboardHome.module.scss";
import Trending from "../../components/home/Trending";
import { LeaderboardItem } from "../../components/dashboard/LeaderboardItem";
import NextEventCard from "../../components/common/NextEventCard/NextEventCard";
import { GetServerSidePropsContext } from "next";
import { fetchWrapper } from "../../util/httpWrapper";
import getServerCookieData from "../../lib/getServerCookieData";

function DashboardHome({ username, leaderboard }: any) {
    return (
        <DashboardLayout
            title="Dashboard | ACM at PEC"
            heading={<div className={styles.title}>Hey {username},</div>}
        >
            <div className={styles.trending}>
                <h2 className={styles.header}>What&#39;s going on?</h2>
                <Trending trendingType="home" />
            </div>
            <div className={styles.details}>
                <div className={styles.contributors}>
                    <h2 className={styles.header}>Top contributors</h2>
                    <div className={styles.leaderboard}>
                        {leaderboard &&
                            leaderboard
                                // .slice(0, 5)
                                .map((user: any, index: any) => {
                                    return (
                                        <LeaderboardItem
                                            user={user}
                                            key={index}
                                        />
                                    );
                                })}
                    </div>
                </div>
                <div className={styles.space}></div>
                {/* <NextEventCard /> */}
            </div>
        </DashboardLayout>
    );
}

export default DashboardHome;

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { data } = getServerCookieData(context);

    const token = data?.token;

    if (!token) {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };
    }

    const leaderboard = await fetchWrapper.get({
        url: "v1/user/leaderboard?offset=0&pageSize=5",
        token,
    });

    return {
        props: {
            username: data?.user?.name,
            leaderboard,
        },
    };
}
