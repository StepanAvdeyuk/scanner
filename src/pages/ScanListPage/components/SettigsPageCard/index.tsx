import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProgressBar from '../../../../shared/ui-kit/ProgressBar';
import css from './index.module.scss';
import * as API from '../../../../API/api';

interface ScanSettings {
    scan: string;
    status?: string;
    percentage?: string;
    [key: string]: any; // Для отображения всех полей, которые могут быть в ответе
}

const SettingsPageCard: FC = () => {
    const [scanSettings, setScanSettings] = useState<ScanSettings | undefined>();
    const [error, setError] = useState<string | null>(null);
    const { reportId } = useParams();

    useEffect(() => {
        const fetchScanSettings = async () => {
            if (reportId === 'undefined') {
                return;
            }

            try {
                const scanResponse = await API.getReportSettings(Number(reportId));

                setScanSettings(scanResponse);
                setError(null);
            } 
            catch (error) {
                setError('Ошибка при получении настроек скана');
                console.error('Ошибка при получении настроек скана:', error);
            }
        };

        fetchScanSettings();
    }, [reportId]);

    const renderSettings = (settings: any) => {
        return Object.entries(settings).map(([key, value]) => {
            if (typeof value === 'object' && value !== null) {
                return (
                    <div key={key}>
                        <strong>{key}:</strong>
                        <div className={css.settingsNested}>
                            {renderSettings(value)}
                        </div>
                    </div>
                );
            } else {
                return (
                    <div key={key} className={css.setting}>
                        <strong>{key}:</strong> {value !== null ? value.toString() : 'null'}
                    </div>
                );
            }
        });
    };

    return (
        <div className={css.settingsPageWrapper}>
            {error ? (
                <div>{error}</div>
            ) : (
                scanSettings && (
                    <>
                        {scanSettings.status === 'Active' && scanSettings.percentage && (
                            <div className={css.settingsPageStatusWrapper}>
                                <span>Status</span>
                                <ProgressBar
                                    active={true}
                                    percentage={parseInt(scanSettings.percentage, 10)}
                                />
                            </div>
                        )}
                        <div className={css.settingsContentWrapper}>
                            {renderSettings(scanSettings)}
                        </div>
                    </>
                )
            )}
        </div>
    );
};

export default SettingsPageCard;
