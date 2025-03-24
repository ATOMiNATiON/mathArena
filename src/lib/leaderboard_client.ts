import { actions } from "astro:actions";
import { type User } from "./LeaderboardUsers";

async function getHighScoreUsersFirebase(): Promise<User[]> {
    const TopHighScoreUsers = await actions.getHighScorePlayers();
    return TopHighScoreUsers.data!;
}

function createLeaderboardItem(user: User, index: number) {
    const item = document.createElement('div');
    item.className = 'leaderboard-item';
    item.style.animationDelay = `${ index * 0.1 }s`
    
    item.innerHTML = `
        <div class="rank">${index + 1}</div>
        <div class="user-info"> 
            <div class="username">${user.displayName}</div>
        </div>
        <div class="score-info">
            <div class="score">Score: ${user.score}</div>
        </div>
    `;

    return item;
}

export function renderLeaderboard() {

    const content = document.querySelector('.content') as HTMLElement;
    content.innerHTML = '';

    getHighScoreUsersFirebase().then((TopHighScoreUsers) => {
        for (let index = 0; index < TopHighScoreUsers.length; index++) {
            const item = createLeaderboardItem(TopHighScoreUsers[index], index);
            content.appendChild(item);
        }
    })

}