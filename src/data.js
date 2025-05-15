// * Fake data

import { faker } from '@faker-js/faker';

function formatFloatWithSpaces(value) {
    return value.replace('.', ' . ');
}

export function createRandomLeaderboard(rank) {
    return {
        rank,
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
        })
    }
}

export const leaderboards = faker.helpers.multiple(createRandomLeaderboard, {
    count: 7,
});