// * Fake data

import { faker } from '@faker-js/faker';

function formatFloatWithSpaces(value) {
    return value.replace('.', ' . ');
}

// const icon = faker.helpers.arrayElement(['globe']);

export function createRandomLeaderboard(rank) {
    return {
        rank,
        mode: Number(faker.helpers.arrayElement([15, 60])),
        language: faker.helpers.arrayElement(['English', 'Myanmar']),
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
    }
}

export const leaderboards = faker.helpers.multiple(createRandomLeaderboard, {
    count: 50,
});

export function createRandomHistory() {
    const rawWpm = faker.number.float({ min: 30, max: 100 });

    return {
        wpm: rawWpm,
        formattedWpm: formatFloatWithSpaces(rawWpm.toFixed(2)),
        accuracy: formatFloatWithSpaces(faker.number.float({ min: 60, max: 100 }).toFixed(2)) + '%',
        raw: formatFloatWithSpaces(faker.number.float({ min: 60, max: 100 }).toFixed(2)) + '%',
        consistency: formatFloatWithSpaces(faker.number.float({ min: 60, max: 100 }).toFixed(2)),
        correct: Number(faker.number.int({ min: 30, max: 100 })),
        wrong: Number(faker.number.int({ min: 1, max: 20 })),
        language: faker.helpers.arrayElement(['English', 'Myanmar']),
        mode: Number(faker.helpers.arrayElement([15, 60])),
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
    count: 10
});

export const typingStats = [
    { label: 'Tests completed', value: 4 },
];

export const typingSpeeds = [
    { time: 15, wpm: 69, accuracy: 94 },
    { time: 60, wpm: 59, accuracy: 90 }
];

export const typingOverview = [
    { label: 'Tests completed', value: 4 },
    { time: 15, wpm: 69, accuracy: 94 },
    { time: 60, wpm: 59, accuracy: 90 }
];