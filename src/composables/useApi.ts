import { configSvc } from '@/components/rfidsecuritysvc/Config';
import errorToString from '@/components/Error.js';
import { guestMediaSvc } from '@/components/rfidsecuritysvc/GuestMedia';
import { guestsSvc } from '@/components/rfidsecuritysvc/Guests';
import { mediaSvc } from '@/components/rfidsecuritysvc/Media';
import { mediaPermsSvc } from '@/components/rfidsecuritysvc/MediaPerms';
import { permissionSvc } from '@/components/rfidsecuritysvc/Permission';
import { playerSvc } from '@/components/rfidsecuritysvc/Player';
import { readerSvc } from '@/components/rfidsecuritysvc/Reader';
import { soundSvc } from '@/components/rfidsecuritysvc/Sound';
import { useAxios } from '@/composables/useAxios';
import { AxiosInstance } from 'axios';

export function useApi() {
    const axios: AxiosInstance = useAxios();

    if (!axios) {
        throw new Error('useApi() must be used within a component tree where AxiosPlugin is installed.');
    }

    return {
        config: configSvc(axios),
        errorToString: errorToString,
        guestMedia: guestMediaSvc(axios),
        guests: guestsSvc(axios),
        media: mediaSvc(axios),
        mediaPerms: mediaPermsSvc(axios),
        permission: permissionSvc(axios),
        player: playerSvc,
        reader: readerSvc(axios),
        sound: soundSvc(axios),
    }
}