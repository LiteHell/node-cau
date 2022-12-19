import { time } from "console";

type CauDayNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6

/**
 * Representiation of time when class begins and ends
 */
type CauSubjectScheduleTimeslot = {
    /**
     * Day
     * 
     * Monday is 0
     */
    day: CauDayNumber;

    /**
     * When class starts At, in unit of minute
     * 
     * For example, 01:10 is 70.
     */
    timeStartsAt: number,

    /**
     * When class ends At, in unit of minute
     * 
     * For example, 01:10 is 70.
     */
    timeEndsAt: number,
}

type CauSubjectSchedule = {
    times: CauSubjectScheduleTimeslot[],
    location: string | null
};

function dayStringToNumber(dayString: string): CauDayNumber {
    switch (dayString) {
        case '월': return 0;
        case '화': return 1;
        case '수': return 2;
        case '목': return 3;
        case '금': return 4;
        case '토': return 5;
        case '일': return 6;
        default: throw new Error('dayString parameter should be one of "월", "화", "수", "목", "금", "토", "일"');
    }
}

function timeStringToMinuteNumber(timeString: string): number {
    const splitted = timeString.trim().split(':');

    return parseInt(splitted[0]) * 60 + parseInt(splitted[1]);
}

function classSlotToMinuteNumber(classSlotString: number): number {
    return classSlotString * 60 + 480; // 1교시 = 09:00
}

/**
 * Parses schedule string of subject into machine-friendly objects
 * @param schedule schedule string of subject
 * @returns Parsed object
 */
export default function parseSubjectSchedule(schedule: string): CauSubjectSchedule[] {
    if (schedule.trim() == '/')
        return [];

    const splitted = schedule.split('/').map(i => i.trim());
    const times: CauSubjectScheduleTimeslot[][] = [];
    const locations: (string | null)[] = [];

    for (let i = 0; i < splitted.length; i++) {
        let item = splitted[i];
        const isLocation = item.includes('관') || item.includes('호') || item.includes('<') || item.includes('대운동장');

        if (item === '00 000000' || item == '') {
            locations.push(null);
        } else if (isLocation) {
            locations.push(item);
        } else if (!item.includes('<') && item.includes('>')) {
            locations[locations.length - 1] += "/" + item;
        } else{
            const result: CauSubjectScheduleTimeslot[] = [];
            while (item.length > 0) {
                const pattern1 = /(월|화|수|목|금|토|일)\(?([0-9]{1,2}:[0-9]{1,2})~([0-9]{1,2}:[0-9]{1,2})\)?(?:,\s)?/;
                const pattern2 = /(월|화|수|목|금|토|일)((?:(?:1[0-9]|[0-9]),)*(?:1[0-9]|[0-9]))(?:,\s)?/;

                let matched = pattern1.exec(item);
                if (matched !== null) {
                    result.push({
                        day: dayStringToNumber(matched[1]),
                        timeStartsAt: timeStringToMinuteNumber(matched[2]),
                        timeEndsAt: timeStringToMinuteNumber(matched[3])
                    })
                    item = item.replace(matched[0], '');
                } else {

                    matched = pattern2.exec(item);
                    if (matched !== null) {
                        const day = dayStringToNumber(matched[1]);
                        let startsAt: number | null = null, endsAt: number | null = null;
                        const numbers = matched[2].split(',').map(i => parseInt(i));
                        for (let i = 0; i < numbers.length; i++) {
                            const now = classSlotToMinuteNumber(numbers[i]);
                            if (startsAt == null) {
                                startsAt = now;
                                endsAt = now + 60;
                            } else if (endsAt === now) {
                                endsAt = now + 60;
                            } else {
                                result.push({
                                    day,
                                    timeStartsAt: startsAt,
                                    timeEndsAt: endsAt == null ? startsAt : endsAt
                                });
                                startsAt = now;
                                endsAt = now + 60;
                            }
                        }

                        if (startsAt !== null) {
                            result.push({
                                day,
                                timeStartsAt: startsAt,
                                timeEndsAt: endsAt == null ? startsAt : endsAt
                            });
                        }
                        item = item.replace(matched[0], '');

                    }
                }

                item = item.trim();
            }

            times.push(result);
        }
    }

    const result: CauSubjectSchedule[] = [];
    if (locations.length == 1) {
        for (const i of times) {
            result.push({
                location: locations[0],
                times: i
            })
        }
    } else {
        if (times.length !== locations.length)
            throw new Error('Timeslot length != Location length');
        for (let i = 0; i < times.length; i++) {
            result.push({
                location: locations[i],
                times: times[i]
            });
        }
    }

    return result;
}