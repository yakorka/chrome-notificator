import { MESSAGE_CHANNEL_DOWNLOAD, PARSE_SERCONDS_TIMEOUT, PARSE_URL_LINK } from "../utils/constants";

let current_video_link: string;

interface IItem {
    desc: string;
    id: string;
    video: {
        cover: string;
        downloadAddr: string;
        dynamicCover: string;
    }
};

interface IUserInfo {
    user: {
        avatarMedium: string;
    }
};

interface IPageProps {
    items: IItem[];
    userInfo: IUserInfo;
};

interface IProps {
    pageProps: IPageProps;
};

interface IData {
    props: IProps;
};

const getLastContentId = (): Promise<string> => {
    return new Promise(resolve => {
        chrome.storage.sync.get(['lastContentId'], result => {
            resolve(result.lastContentId);
        });
    });
};

const setLastContentId = (id: string) => {
    chrome.storage.sync.set({["lastContentId"]: id});
};

const isNewContent = async (id: string): Promise<boolean> => {
    return (await getLastContentId()) !== id;
};

chrome.notifications.onButtonClicked.addListener(() => {
    chrome.tabs.create({ url: current_video_link });
});

setInterval(async () => {
    const response = await fetch(PARSE_URL_LINK, {
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:86.0) Gecko/20100101 Firefox/86.0'
        }
    });

    const data: IData = JSON.parse((await response.text()).match(/(?<=__NEXT_DATA__.*?>).*?(?=<\/script>)/)[0]);

    const contentId = data.props.pageProps.items[0].id;

    if (await isNewContent(contentId)) {
        setLastContentId(contentId);

        current_video_link = data.props.pageProps.items[0].video.downloadAddr;

        chrome.notifications.create({
            iconUrl: data.props.pageProps.userInfo.user.avatarMedium,
            imageUrl: data.props.pageProps.items[0].video.dynamicCover,
            title: '@yakorka: новое видево',
            message: data.props.pageProps.items[0].desc,
            buttons: [
                { title: "открыть" }
            ],
            type: 'image'
        });

        new Audio('audio/beep.mp3').play();
    }
    
}, PARSE_SERCONDS_TIMEOUT * 1000);