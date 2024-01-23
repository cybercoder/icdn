import { BadRequestException, NestMiddleware, Req } from '@nestjs/common';
import { RequestHandler } from '@nestjs/common/interfaces';
import { FastifyReply, FastifyRequest } from 'fastify';

import { createProxyMiddleware } from 'http-proxy-middleware';

export class KongGetMiddlewareV1Alpha1 implements NestMiddleware {
  private proxy?: RequestHandler;
  constructor() {
    this.proxy = createProxyMiddleware({
      target: process.env.KONG_ADMIN_API_URI,
      ws: true,
    });
  }

  use(req: FastifyRequest, res: FastifyReply, next: (error?: any) => void) {
    const { query }: any = req;
    const namespaceMatch = req.originalUrl.match(
      /^\/apis\/cdn\.ik8s\.ir\/v1alpha1\/namespaces\/([^\/]*)\/(.*)$/,
    );
    const namespace = namespaceMatch ? namespaceMatch[1] : undefined;
    if (!namespace) throw new BadRequestException();

    const modifiedQuerString = Object.entries(query).reduce(
      (r: string, [key, value]) => {
        key !== 'tags' &&
          (r += (r.length === 0 ? '?' : `&`) + `${key}=${value.toString()}`);
        return r;
      },
      `?tags=ns-${namespace}`,
    );

    const url = {
      writable: true,
      value: '/' + namespaceMatch[2].split('?')[0] + modifiedQuerString,
    };

    const modifiedReq: FastifyRequest = Object.create(req, {
      url,
      originalUrl: url,
    });

    this.proxy(modifiedReq, res, next);
  }
}

export class KongOtherMethodsMiddlewareV1Alpha1 implements NestMiddleware {
  private proxy?: RequestHandler;
  constructor() {
    this.proxy = createProxyMiddleware({
      target: process.env.KONG_ADMIN_API_URI,
      ws: true,
    });
  }

  use(req: FastifyRequest, res: FastifyReply, next: (error?: any) => void) {
    const { body }: any = req;
    console.log(req.body);
    const namespaceMatch = req.originalUrl.match(
      /^\/apis\/cdn\.ik8s\.ir\/v1alpha1\/namespaces\/([^\/]*)\/(.*)$/,
    );
    const namespace = namespaceMatch ? namespaceMatch[1] : undefined;
    if (!namespace) throw new BadRequestException();

    // body.tags = [`ns-${namespace}`];
    const url = {
      writable: true,
      value: '/' + namespaceMatch[2].split('?')[0],
    };

    const modifiedReq: FastifyRequest = Object.create(req, {
      url,
      originalUrl: url,
    });
    this.proxy(modifiedReq, res, next);
  }
}
