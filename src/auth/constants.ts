// export const IS_PUBLIC_KEY = 'isPublic';
//
// // 커스덤 데코레이터 선언 => 로그인 필요 없이 누구나 사용 가능한 컨트롤러에 적용
// export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

/*
  아래와 같이 사용하면, 인증 가드 통과
  @Public()
  @Get()
  findAll() {
    return [];
  }
*/

export const jwtConstants = {
  secret: process.env.JWT_SECRET,
};
