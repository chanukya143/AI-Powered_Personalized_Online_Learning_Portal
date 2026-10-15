package com.example.onlinelearningportal.dto;

import java.util.List;

public class QuestionDetailResponse {

    private Long id;
    private String questionText;
    private List<String> options;
    private Integer questionOrder;

    public QuestionDetailResponse() {
    }

    public QuestionDetailResponse(Long id, String questionText, List<String> options, Integer questionOrder) {
        this.id = id;
        this.questionText = questionText;
        this.options = options;
        this.questionOrder = questionOrder;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public List<String> getOptions() {
        return options;
    }

    public void setOptions(List<String> options) {
        this.options = options;
    }

    public Integer getQuestionOrder() {
        return questionOrder;
    }

    public void setQuestionOrder(Integer questionOrder) {
        this.questionOrder = questionOrder;
    }
}
