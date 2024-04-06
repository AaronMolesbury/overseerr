import AirDateBadge from '@app/components/AirDateBadge';
import LoadingSpinner from '@app/components/Common/LoadingSpinner';
import type { SeasonWithEpisodes } from '@server/models/Tv';
import { defineMessages, useIntl } from 'react-intl';
import useSWR from 'swr';
import Badge from '@app/components/Common/Badge';
import globalMessages from '@app/i18n/globalMessages';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

type SeasonProps = {
    seasonNumber: number;
    tvId: number;
};

const messages = defineMessages({
    somethingwentwrong: 'Something went wrong while retrieving season data.',
    noepisodes: 'Episode list unavailable.',
    seasonnumber: 'Season {number}',
});

const ExpandedSeason = ({ seasonNumber, tvId }: SeasonProps) => {
    const intl = useIntl();
    const { data, error } = useSWR<SeasonWithEpisodes>(
        `/api/v1/tv/${tvId}/season/${seasonNumber}`
    );

    if (!data && !error) {
        return <LoadingSpinner />;
    }

    if (!data) {
        return <div>{intl.formatMessage(messages.somethingwentwrong)}</div>;
    }

    return (
        <div className="flex flex-col justify-center divide-y divide-gray-700">
            <table className="min-w-full bg-gray-900 bg-opacity-70">
                <tbody className="divide-y divide-gray-700">
                    {data.episodes.length === 0 ? (
                        <p>{intl.formatMessage(messages.noepisodes)}</p>
                    ) : (
                        data.episodes
                            .slice()
                            .map((episode) => {
                                return (
                                    <tr key={`episode-${episode.id}`} className="cursor-pointer">
                                        <td className="w-16 whitespace-nowrap pr-4 pl-4 md:pl-10 py-4 text-sm font-medium leading-5 text-gray-100">
                                            <span
                                                role="checkbox"
                                                tabIndex={0}
                                                aria-checked={
                                                    false
                                                }
                                                className="relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer items-center justify-center pt-2 focus:outline-none"
                                            >
                                                <span
                                                    aria-hidden="true"
                                                    className="bg-indigo-500 absolute mx-auto h-4 w-9 rounded-full transition-colors duration-200 ease-in-out"
                                                ></span>
                                                <span
                                                    aria-hidden="true"
                                                    className="translate-x-0' absolute left-0 inline-block h-5 w-5 rounded-full border border-gray-200 bg-white shadow transition-transform duration-200 ease-in-out group-focus:border-blue-300 group-focus:ring"
                                                ></span>
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-1 py-4 text-sm font-medium leading-5 text-gray-100 md:px-6">
                                            {episode.episodeNumber} - {episode.name}
                                        </td>
                                        <td className="whitespace-nowrap px-1 py-4 text-sm font-medium leading-5 text-gray-100 md:px-6 hidden sm:block">
                                            {episode.airDate && (
                                                <AirDateBadge airDate={episode.airDate} />
                                            )}
                                        </td>
                                        <td className="whitespace-nowrap py-4 pr-2 text-sm leading-5 text-gray-200 md:px-6">
                                            {
                                                <Badge>
                                                    {intl.formatMessage(
                                                        globalMessages.notrequested
                                                    )}
                                                </Badge>
                                            }
                                        </td>
                                    </tr>
                                );
                            })
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ExpandedSeason;
