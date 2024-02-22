import {
  ForbiddenException,
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { resolveTxt } from 'dns/promises';
@Injectable()
export class RouteUsecases {
  constructor(private readonly configService: ConfigService) {}
  public async create({
    id,
    data,
    namespace,
  }: {
    id: number | string;
    data: any;
    namespace: string;
  }) {
    await Promise.all(
      data.hosts.map((host: string) => this.checkDNSRecord(namespace, host)),
    );
    let tags = data.tags?.filter((t: string) => !t.startsWith('ns-'));
    tags ? tags.push(`ns-${namespace}`) : (tags = [`ns-${namespace}`]);
    return axios
      .post(
        `${this.configService.getOrThrow(
          'KONG_ADMIN_API_URI',
        )}/services/${id}/routes`,
        {
          ...data,
          tags,
        },
      )
      .then(({ data }) => data)
      .catch((e) => {
        throw new HttpException(
          e.response.data || e.message,
          e.response.status || 500,
        );
      });
  }

  private async checkDNSRecord(namespace: string, host: string) {
    const IK8S_CDN_VERIFY_PREFIX = this.configService.getOrThrow(
      'IK8S_CDN_VERIFY_PREFIX',
    );
    try {
      const txtVal: string[][] = await resolveTxt(
        `${IK8S_CDN_VERIFY_PREFIX}.${host}`,
      );

      if (!txtVal || !txtVal.flat().includes(namespace)) {
        Logger.debug('TXT forbidden');
        throw new ForbiddenException(
          `The domain ${host} has no proper TXT record.`,
        );
      }
    } catch (e) {
      if (e.code === 'ENODATA') {
        throw new NotFoundException(
          `TXT verification record for ${host} not found`,
        );
      } else {
        throw e;
      }
    }
  }
}
