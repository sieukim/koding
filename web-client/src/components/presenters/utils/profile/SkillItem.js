import { Tag } from 'antd';
import { getTagColor } from '../function/getTagColor';

export const SkillItem = (props) => {
  const {
    skills = ['자바스크립트', 'React', 'Node.js', 'Ruby on Rails', 'Django'],
    interests = [
      '프론트엔드',
      '클라우드',
      '인공지능',
      '머신러닝',
      '데이터 사이언스',
    ],
    className,
  } = props;

  const skillTags =
    skills.length > 0
      ? skills.map((skill) => (
          <Tag key={skill} color={getTagColor(skill)} className="skill-tag">
            {skill}
          </Tag>
        ))
      : '보유 기술이 없습니다.';

  const interestTags =
    interests.length > 0
      ? interests.map((interest) => (
          <Tag
            key={interest}
            color={getTagColor(interest)}
            className="interest-tag"
          >
            {interest}
          </Tag>
        ))
      : '관심 분야가 없습니다.';

  return (
    <div className={className}>
      <div className="skill-item-skills">
        <p className="skill-item-header">보유 기술</p>
        {skillTags}
      </div>
      <div className="skill-item-interests">
        <p className="skill-item-header">관심 분야</p>
        {interestTags}
      </div>
    </div>
  );
};
