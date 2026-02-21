const authRegex = /^Bearer /i;

export class Authorization {

  static check(token?: string): string {
    try {
      if (!token || token.replace(authRegex, '')) {
        throw 'Authorization no token information.';
      }
      return token;
    } catch (e: unknown) {
      return e as string;
    }
  }
}
