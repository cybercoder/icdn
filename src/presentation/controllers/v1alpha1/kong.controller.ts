import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import axios from 'axios';

@Controller({
  version: '1alpha1',
})
@ApiTags('v1alpha1', 'proxy')
export class KongController {
  constructor(private readonly configService: ConfigService) {}
  // @Get('/:path')
  // async proxyGET(
  //   @Param() { namespace, path }: { namespace: string; path: string },
  // ) {
  //   return axios
  //     .get(
  //       `${this.configService.getOrThrow(
  //         'KONG_ADMIN_API_URI',
  //       )}/${path}?tags=ns-${namespace}`,
  //     )
  //     .then(({ data }) => data)
  //     .catch((e) => {
  //       throw new HttpException(
  //         e.response.data || e.message,
  //         e.response.status || 500,
  //       );
  //     });
  // }
  @Get('/')
  health() {
    return true;
  }

  @Post('/namespaces/:namespace/upstreams/:id/targets')
  async proxyTargetPost(
    @Param() { namespace, id }: { namespace: string; id: string },
    @Body() data,
  ) {
    let tags = data.tags?.filter((t: string) => !t.startsWith('ns-'));
    tags ? tags.push(`ns-${namespace}`) : (tags = [`ns-${namespace}`]);
    return axios
      .post(
        `${this.configService.getOrThrow(
          'KONG_ADMIN_API_URI',
        )}/upstreams/${id}/targets`,
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

  @Post('/namespaces/:namespace/services/:id/routes')
  async proxyServiceRoutePost(
    @Param() { namespace, id }: { namespace: string; id: string },
    @Body() data,
  ) {
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
  @Post('/namespaces/:namespace/:path')
  async proxyPost(
    @Param() { namespace, path }: { namespace: string; path: string },
    @Body() data,
  ) {
    let tags = data.tags?.filter((t: string) => !t.startsWith('ns-'));
    tags ? tags.push(`ns-${namespace}`) : (tags = [`ns-${namespace}`]);
    return axios
      .post(`${this.configService.getOrThrow('KONG_ADMIN_API_URI')}/${path}`, {
        ...data,
        tags,
      })
      .then(({ data }) => data)
      .catch((e) => {
        throw new HttpException(
          e.response.data || e.message,
          e.response.status || 500,
        );
      });
  }
  @Put('/namespaces/:namespace/:path')
  async proxyPut(
    @Param() { namespace, path }: { namespace: string; path: string },
    @Body() data,
  ) {
    let tags = data.tags?.filter((t: string) => !t.startsWith('ns-'));
    tags ? tags.push(`ns-${namespace}`) : (tags = [`ns-${namespace}`]);
    return axios
      .put(`${this.configService.getOrThrow('KONG_ADMIN_API_URI')}/${path}`, {
        ...data,
        tags,
      })
      .then(({ data }) => data)
      .catch((e) => {
        throw new HttpException(
          e.response.data || e.message,
          e.response.status || 500,
        );
      });
  }
  @Patch('/namespaces/:namespace/:path')
  async proxyPatch(
    @Param() { namespace, path }: { namespace: string; path: string },
    @Body() data,
  ) {
    let tags = data.tags?.filter((t: string) => !t.startsWith('ns-'));
    tags ? tags.push(`ns-${namespace}`) : (tags = [`ns-${namespace}`]);
    return axios
      .patch(`${this.configService.getOrThrow('KONG_ADMIN_API_URI')}/${path}`, {
        ...data,
        tags,
      })
      .then(({ data }) => data)
      .catch((e) => {
        throw new HttpException(
          e.response.data || e.message,
          e.response.status || 500,
        );
      });
  }
  @Delete('/namespaces/:namespace/:path')
  async proxyDelete(
    @Param() { namespace, path }: { namespace: string; path: string },
    @Body() data,
  ) {
    let tags = data.tags?.filter((t: string) => !t.startsWith('ns-'));
    tags ? tags.push(`ns-${namespace}`) : (tags = [`ns-${namespace}`]);
    return axios
      .patch(`${this.configService.getOrThrow('KONG_ADMIN_API_URI')}/${path}`, {
        ...data,
        tags,
      })
      .then(({ data }) => data)
      .catch((e) => {
        throw new HttpException(
          e.response.data || e.message,
          e.response.status || 500,
        );
      });
  }
}
