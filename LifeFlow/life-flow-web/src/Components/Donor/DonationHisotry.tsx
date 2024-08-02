import { DonationSlot, formatDateToIST } from "../../types/DonationTypes.ts";
import { TimeLineTickSvg } from "../../assets/TimeLineTickSvg.tsx";
import { useTranslation } from "react-i18next";

interface HistoryProps {
    history: DonationSlot[];
}

export function DonationHistory({ history }: HistoryProps) {
    const { t } = useTranslation();

    return (
        <div className="card bg-base-200 h-fit rounded-btn">
            <div className="card-body">
                <h2 className="card-title">{t("donationHistory.title")}</h2>
            </div>
            {history.length === 0 ? (
                <div className="timeline-box">{t("donationHistory.noDonations")}</div>
            ) : (
                <ul className="timeline timeline-vertical">
                    {history.map((donation, index) => (
                        <li key={index}>
                            {index != 0 && <hr className="bg-accent" />}
                            <div className="timeline-middle">
                                <TimeLineTickSvg />
                            </div>
                            {index % 2 === 0 ? (
                                <div className="timeline-start timeline-box bg-base-300 shadow-lg">
                                    <p>
                                        {t("donationHistory.donatedOn")} {formatDateToIST(donation.slotTime)} {t("donationHistory.at")} {donation.centerName}
                                        <div className="badge badge-secondary">{donation.slotStatus}</div>
                                    </p>
                                </div>
                            ) : (
                                <div className="timeline-end timeline-box bg-base-300 shadow-lg">
                                    <p>
                                        {t("donationHistory.donatedOn")} {formatDateToIST(donation.slotTime)} {t("donationHistory.at")} {donation.centerName}
                                        <div className="badge badge-secondary">{donation.slotStatus}</div>
                                    </p>
                                </div>
                            )}
                            <hr className="bg-accent" />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
