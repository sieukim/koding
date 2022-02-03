export class SuspendUserAccountQueryDto {
  /*
   * 계정을 영구정지할지 여부
   * true 로 설정하면 1000년 정지
   */
  forever?: boolean = false;

  /*
   * 계정을 정지할 일수.forever 가 true 이면 무시됨.
   */
  suspendDay?: number = 1;
}
