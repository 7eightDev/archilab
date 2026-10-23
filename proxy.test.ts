/**
 * @jest-environment node
 */
// The docs name it unstable_doesProxyMatch; 16.4.2 still exports the middleware name.
import { getRewrittenUrl, isRewrite, unstable_doesMiddlewareMatch } from 'next/experimental/testing/server'
import { NextRequest } from 'next/server'
import { MISSING_PROJECT_SLUG } from './app/progetti/missing-project'
import { config, proxy } from './proxy'

function request(path: string) {
  return new NextRequest(`https://archilab.example${path}`)
}

describe('proxy', () => {
  it('runs on project pages only', () => {
    expect(unstable_doesMiddlewareMatch({ config, url: '/progetti/appartamento-fondi' })).toBe(true)
    expect(unstable_doesMiddlewareMatch({ config, url: '/progetti' })).toBe(false)
    expect(unstable_doesMiddlewareMatch({ config, url: '/' })).toBe(false)
  })

  it('lets a known project through', async () => {
    const response = await proxy(request('/progetti/appartamento-fondi'))

    expect(isRewrite(response)).toBe(false)
  })

  // Every unknown slug would otherwise be rendered and cached on its own.
  it('sends every unknown slug to the one missing-project page', async () => {
    for (const slug of ['zzz1', 'zzz2']) {
      const response = await proxy(request(`/progetti/${slug}?ref=x`))

      expect(isRewrite(response)).toBe(true)
      expect(getRewrittenUrl(response)).toBe(`https://archilab.example/progetti/${MISSING_PROJECT_SLUG}`)
    }
  })
})
