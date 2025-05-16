// * Fake data

import { faker } from '@faker-js/faker';

function formatFloatWithSpaces(value) {
    return value.replace('.', ' . ');
}

const icon = faker.helpers.arrayElement(['globe', 'star', 'flame']);

export function createRandomLeaderboard(rank) {
    return {
        rank,
        profile: faker.image.avatar(),
        name: faker.person.fullName(),
        wpm: formatFloatWithSpaces(faker.number.float({ min: 30, max: 100 }).toFixed(2)),
        accuracy: formatFloatWithSpaces(faker.number.float({ min: 60, max: 100 }).toFixed(2)) + '%',
        raw: formatFloatWithSpaces(faker.number.float({ min: 60, max: 100 }).toFixed(2)) + '%',
        consistency: formatFloatWithSpaces(faker.number.float({ min: 60, max: 100 }).toFixed(2)),
        date: faker.date.recent().toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: "numeric",
            hour: '2-digit',
            minute: '2-digit',
        }),
        time: formatFloatWithSpaces(faker.date.recent().toLocaleString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
        }))
    }
}

export const leaderboards = faker.helpers.multiple(createRandomLeaderboard, {
    count: 5,
});

export function createRandomHistory() {
    return {
        wpm: formatFloatWithSpaces(faker.number.float({ min: 30, max: 100 }).toFixed(2)),
        accuracy: formatFloatWithSpaces(faker.number.float({ min: 60, max: 100 }).toFixed(2)) + '%',
        raw: formatFloatWithSpaces(faker.number.float({ min: 60, max: 100 }).toFixed(2)) + '%',
        consistency: formatFloatWithSpaces(faker.number.float({ min: 60, max: 100 }).toFixed(2)),
        correct: Number(faker.number.int({ min: 30, max: 100 })),
        wrong: Number(faker.number.int({ min: 1, max: 20 })),
        mode: Number(faker.helpers.arrayElement([15, 60])),
        info: icon,
        date: faker.date.recent().toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: "numeric",
            hour: '2-digit',
            minute: '2-digit',
        }),
    }
}

export const histories = faker.helpers.multiple(createRandomHistory, {
    count: 5
})