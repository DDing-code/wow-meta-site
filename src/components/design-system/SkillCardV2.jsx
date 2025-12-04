import React from 'react';
import { cn } from '@/lib/utils';
import { getIconUrl } from './tokens';

/**
 * SkillCardV2 - Magic MCP 스타일 기반 WoW 스킬 카드
 * 
 * Dark Grid 컴포넌트 스타일 적용
 * - 다크 테마 + 보라색 악마사냥꾼 악센트
 * - 호버 시 글로우 이펙트
 * - 코너 스퀘어 애니메이션
 */

const classThemes = {
  DemonHunter: {
    primary: '#A330C9',
    secondary: '#6B1D84',
    glow: 'rgba(163, 48, 201, 0.4)',
  },
  Warrior: {
    primary: '#C79C6E',
    secondary: '#8B6914',
    glow: 'rgba(199, 156, 110, 0.4)',
  },
  Mage: {
    primary: '#69CCF0',
    secondary: '#3FC7EB',
    glow: 'rgba(105, 204, 240, 0.4)',
  },
  // 다른 직업들 추가 가능
};

export const SkillCardV2 = ({
  skill,
  size = 'medium',
  classType = 'DemonHunter',
  showDescription = true,
  showCooldown = true,
  highlight = false,
  onClick,
}) => {
  const theme = classThemes[classType] || classThemes.DemonHunter;
  
  const sizeConfig = {
    small: { icon: 40, padding: 'p-3', gap: 'gap-3', title: 'text-sm', desc: 'text-xs' },
    medium: { icon: 48, padding: 'p-4', gap: 'gap-4', title: 'text-base', desc: 'text-sm' },
    large: { icon: 56, padding: 'p-5', gap: 'gap-4', title: 'text-lg', desc: 'text-base' },
  };
  
  const config = sizeConfig[size];

  return (
    <div
      onClick={onClick}
      className={cn(
        // Base styles
        "group relative overflow-visible rounded-xl",
        "bg-gradient-to-b from-[#1E1E32] to-[#151525]",
        "border border-zinc-700/50",
        config.padding,
        
        // Hover effects
        "transition-all duration-300 ease-out",
        "hover:border-opacity-100 hover:-translate-y-0.5",
        "hover:shadow-lg",
        
        // Cursor
        onClick && "cursor-pointer"
      )}
      style={{
        '--accent-color': theme.primary,
        '--glow-color': theme.glow,
        borderColor: highlight ? theme.primary : undefined,
        boxShadow: highlight ? `0 0 20px ${theme.glow}` : undefined,
      }}
    >
      {/* Subtle gradient overlay on hover */}
      <div 
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `linear-gradient(135deg, ${theme.primary}10 0%, transparent 50%)`,
        }}
      />
      
      {/* Corner squares on hover */}
      <div className="pointer-events-none absolute inset-0 hidden group-hover:block">
        <div 
          className="absolute -left-1.5 -top-1.5 h-2.5 w-2.5"
          style={{ backgroundColor: theme.primary }}
        />
        <div 
          className="absolute -right-1.5 -top-1.5 h-2.5 w-2.5"
          style={{ backgroundColor: theme.primary }}
        />
        <div 
          className="absolute -left-1.5 -bottom-1.5 h-2.5 w-2.5"
          style={{ backgroundColor: theme.primary }}
        />
        <div 
          className="absolute -right-1.5 -bottom-1.5 h-2.5 w-2.5"
          style={{ backgroundColor: theme.primary }}
        />
      </div>

      {/* Card Content */}
      <div className={cn("relative z-10 flex items-start", config.gap)}>
        {/* Icon */}
        <div 
          className="relative flex-shrink-0 rounded-lg overflow-hidden"
          style={{
            width: config.icon,
            height: config.icon,
            border: `2px solid ${theme.primary}`,
            boxShadow: `0 0 12px ${theme.glow}`,
          }}
        >
          <img
            src={getIconUrl(skill.icon, 'large')}
            alt={skill.name_kr || skill.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = getIconUrl('inv_misc_questionmark', 'large');
            }}
          />
          {/* Icon glow effect */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle, ${theme.glow} 0%, transparent 70%)`,
            }}
          />
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h4 
            className={cn(
              "font-semibold text-zinc-100 mb-1",
              config.title
            )}
          >
            {skill.name_kr || skill.name}
          </h4>

          {/* Description */}
          {showDescription && skill.effect_summary && (
            <p className={cn(
              "text-zinc-400 leading-relaxed mb-2 line-clamp-2",
              config.desc
            )}>
              {skill.effect_summary}
            </p>
          )}

          {/* Tags */}
          {showCooldown && (
            <div className="flex flex-wrap gap-2">
              {skill.cooldown && (
                <span 
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                  style={{
                    backgroundColor: `${theme.primary}20`,
                    color: theme.primary,
                  }}
                >
                  ⏱ {skill.cooldown}
                </span>
              )}
              {skill.cast_time && (
                <span 
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                  style={{
                    backgroundColor: `${theme.primary}20`,
                    color: theme.primary,
                  }}
                >
                  ⚡ {skill.cast_time}
                </span>
              )}
              {skill.resource_cost && skill.resource_cost !== '없음' && (
                <span 
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                  style={{
                    backgroundColor: `${theme.primary}20`,
                    color: theme.primary,
                  }}
                >
                  💢 {skill.resource_cost}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Border glow on hover */}
      <div 
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          boxShadow: `inset 0 0 0 1px ${theme.primary}60, 0 0 15px ${theme.glow}`,
        }}
      />
    </div>
  );
};

/**
 * SkillCardV2Grid - 그리드 레이아웃
 */
export const SkillCardV2Grid = ({ 
  skills, 
  columns = 2, 
  size = 'medium',
  classType = 'DemonHunter',
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={cn("grid gap-4", gridCols[columns] || gridCols[2])}>
      {skills.map((skill, index) => (
        <SkillCardV2
          key={skill.id || index}
          skill={skill}
          size={size}
          classType={classType}
        />
      ))}
    </div>
  );
};

export default SkillCardV2;
