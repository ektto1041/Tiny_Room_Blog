package com.tinyroom.spring.neighbour.dto;

import com.tinyroom.spring.member.domain.Member;

import lombok.AllArgsConstructor;
import lombok.Getter;
//이웃 신청 목록 조회 페이지네이션
@AllArgsConstructor
@Getter
public class NeighbourPageDto {
	  private int neighbourId;
	  private Member fromMember;
	  private String message;
}
