import { Tag } from 'antd';
import { getTagColor } from '../function/getTagColor';

export const TechStackItem = (props) => {
  const { profileUser, className } = props;

  const { techStack = [], interestTech = [] } = profileUser;

  const techStackTags =
    techStack.length > 0
      ? techStack.map((skill) => (
          <Tag key={skill} color={getTagColor(skill)} className="techStack-tag">
            {skill}
          </Tag>
        ))
      : '보유 기술이 없습니다.';

  const interestTechTags =
    interestTech.length > 0
      ? interestTech.map((interest) => (
          <Tag
            key={interest}
            color={getTagColor(interest)}
            className="interestTech-tag"
          >
            {interest}
          </Tag>
        ))
      : '관심 분야가 없습니다.';

  return (
    <div className={className}>
      <div className="techStack-item-techStack">
        <p className="techStack-item-header">보유 기술</p>
        {techStackTags}
      </div>
      <div className="techStack-item-interestTech">
        <p className="techStack-item-header">관심 분야</p>
        {interestTechTags}
      </div>
    </div>
  );
};
