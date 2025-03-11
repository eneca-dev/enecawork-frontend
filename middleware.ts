import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { 
  PUBLIC_ROUTES, 
  AUTH_ROUTES, 
  DEFAULT_AUTH_REDIRECT, 
  DEFAULT_UNAUTHENTICATED_REDIRECT 
} from '@/lib/config/constants';

/**
 * Middleware для защиты маршрутов
 */
export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const token = request.cookies.get('auth-token');
  
  // Если пользователь на корневом пути, перенаправляем в зависимости от статуса аутентификации
  if (pathname === '/') {
    if (token) {
      return NextResponse.redirect(new URL(DEFAULT_AUTH_REDIRECT, request.url));
    }
    return NextResponse.redirect(new URL(DEFAULT_UNAUTHENTICATED_REDIRECT, request.url));
  }

  // Разрешаем доступ к публичным маршрутам без аутентификации
  if (PUBLIC_ROUTES.some(route => pathname === route)) {
    return NextResponse.next();
  }

  // Если пользователь аутентифицирован и пытается получить доступ к страницам аутентификации,
  // перенаправляем на главную страницу дашборда
  if (token && AUTH_ROUTES.some(route => pathname === route)) {
    return NextResponse.redirect(new URL(DEFAULT_AUTH_REDIRECT, request.url));
  }

  // Защищенные маршруты - проверяем наличие аутентификации
  if (!token) {
    // Сохраняем текущий URL в параметрах запроса для перенаправления после входа
    searchParams.set('from', pathname);
    return NextResponse.redirect(new URL(`${DEFAULT_UNAUTHENTICATED_REDIRECT}?${searchParams.toString()}`, request.url));
  }

  return NextResponse.next();
}

/**
 * Конфигурация middleware - указываем, для каких маршрутов применять middleware
 */
export const config = {
  matcher: [
    /*
     * Совпадает со всеми путями, кроме:
     * - api (API-маршруты)
     * - _next/static (файлы в директории static)
     * - _next/image (оптимизированные изображения)
     * - favicon.ico (иконка сайта)
     * - public (публичные файлы)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 